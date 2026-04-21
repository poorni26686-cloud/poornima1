/**
 * useRole Hook
 * Checks if the current user has a specific role (e.g. 'admin').
 */
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppRole = "admin" | "user";

export const useRole = (role: AppRole) => {
  const { user, isLoading: authLoading } = useAuth();
  const [hasRole, setHasRole] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!user) {
        if (active) {
          setHasRole(false);
          setIsLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", role)
        .maybeSingle();
      if (active) {
        setHasRole(!!data);
        setIsLoading(false);
      }
    };
    if (!authLoading) check();
    return () => {
      active = false;
    };
  }, [user, role, authLoading]);

  return { hasRole, isLoading };
};
