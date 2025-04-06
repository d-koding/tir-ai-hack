import { createClient } from "@/utils/supabase/server/createClient";
import type { User, Class, UserClass, UserClassWithClass } from '@/types/types';


export async function createUser(email: string, username: string): Promise<{
  data: User | null;
  error: any;
}> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('users')
        .insert({ email, username })
        .select()
        .single();
    return { data: data as User | null, error };
}

export async function createClass(name: string, description?: string): Promise<{
  data: Class | null;
  error: any;
}> {
    const supabase = await createClient();
  const { data, error } = await supabase
    .from('classes')
    .insert({ name, description })
    .select()
    .single();
  return { data: data as Class | null, error };
}

export async function addUserToClass(userId: string, classId: string): Promise<{
  data: UserClass | null;
  error: any;
}> {
    const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_classes')
    .insert({ user_id: userId, class_id: classId })
    .select()
    .single();
  return { data: data as UserClass | null, error };
}

export async function getUserClasses(userId: string): Promise<{
  data: UserClassWithClass[] | null;
  error: any;
}> {
    const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_classes')
    .select(`
      class_id,
      classes (name, description)
    `)
    .eq('user_id', userId);
  return { data: data as UserClassWithClass[] | null, error };
}