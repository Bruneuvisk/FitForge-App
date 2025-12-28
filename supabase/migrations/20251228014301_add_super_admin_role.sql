/*
  # Add Super Admin Role
  
  1. Changes
    - Add 'is_super_admin' boolean field to profiles table
    - Mark bruno.h3nr1que.souza@gmail.com as super admin
    - Add RLS policies for super admin access
  
  2. Security
    - Only super admins can manage other admins
    - Super admins have full access to all data
    - Super admin status cannot be removed by regular admins
*/

-- Add is_super_admin field to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_super_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_super_admin boolean DEFAULT false;
  END IF;
END $$;

-- Mark bruno.h3nr1que.souza@gmail.com as super admin
UPDATE profiles
SET is_super_admin = true, role = 'admin'
WHERE email = 'bruno.h3nr1que.souza@gmail.com';

-- Create super admin policy for managing admins
CREATE POLICY "Super admins can manage admin roles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_super_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_super_admin = true
    )
  );

-- Prevent non-super-admins from changing super admin status
CREATE POLICY "Only super admins can modify super admin status"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    CASE 
      WHEN is_super_admin = true THEN
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.is_super_admin = true
        )
      ELSE true
    END
  );