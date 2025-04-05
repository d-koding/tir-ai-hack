'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server/createClient'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    return { 
      status: error?.message,
      use: null
      }
  } 

  const {data: existingUser} = await supabase
    .from("user_profiles")
    .select('*')
    .eq('email', credentials?.email)
    .limit(1)
    .single()

    if (!existingUser) {
        const { error: insertError } = await supabase.from("user_profiles").insert({
            email: data?.user.email,
            username: data?.user?.user_metadata?.username,

        })

        if (insertError) {
            return ({
                status: insertError?.message,
                user: null
            })
        }
    }



  revalidatePath("/", "layout");
  return {status: 'success', user: credentials.email}
}

export async function signup(formData: FormData) {
    const supabase = await createClient();
  
    // Minimal validation to ensure inputs are strings
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");
  
    if (!email || typeof email !== "string") {
      return { error: "Email is required and must be a string" };
    }
    if (!password || typeof password !== "string") {
      return { error: "Password is required and must be a string" };
    }
    if (!username || typeof username !== "string") {
      return { error: "Username is required and must be a string" };
    }
  
    const data = {
      email: email as string,
      password: password as string,
      options: {
        data: {
          username: username as string,
        },
      },
    };
  
    const { error } = await supabase.auth.signUp(data);
  
    if (error) {
      return { 
        status: error?.message,
        user: null

        }
    } 
  
    revalidatePath("/", "layout");
    return {status: 'success', user: data.email}
}

export async function signout() {
    const supabase = await createClient();
  
    const { error } = await supabase.auth.signOut();
  
    if (error) {
        return { 
          status: error?.message,
          user: null
  
          }
      } 
    
      revalidatePath("/", "layout");
      return {status: 'success'}
}

export async function getUserSession() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    if (error) {
        return null
    } else {
        return {status: 'success', user: data?.user}
    }
}

export async function signInWithGithub() {
    const origin = (await headers()).get("origin")
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${origin}/auth/callback`
        }
    })

    if (error) {
        redirect('/error')
    } else if (data.url) {
        return redirect(data.url)
    }


}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { error, data } = await supabase.auth.resetPasswordForEmail(
        formData.get("email") as string,
        {
            redirectTo: `${origin}/reset-password`,
        }
    )

    if (error) {
        return {
            status: error?.message,
            user: null,
        }
    }

    return { status: 'success' }
}

export async function resetPassword(formData: FormData, code: string) {
    const supabase = await createClient()
    const {error: CodeError} = await supabase.auth.exchangeCodeForSession(code)

    if (CodeError) {
        return { status: CodeError?.message }
    }

    const { error } = await supabase.auth.updateUser({
        password: formData.get("new-password") as string,
    })

    if (error) {
        return {status: error?.message}
    }

    return { status: 'success' }
}