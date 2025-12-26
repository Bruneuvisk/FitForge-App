/*
  # Fix Admin RLS Policies
  
  1. Problem
    - Current admin policies have circular dependency
    - Admin policies query profiles table to check admin role
    - This causes infinite recursion and 500 errors
  
  2. Solution
    - Create a security definer function to check admin status
    - Update policies to use this function instead of subqueries
*/

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- Recreate admin policies using the security definer function
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin() OR auth.uid() = id)
  WITH CHECK (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Drop the old user-specific policies as they're now included in admin policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
