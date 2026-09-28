CREATE POLICY "Waitlist entries are private"
ON public.waitlist_signups
FOR SELECT
TO authenticated
USING (false);