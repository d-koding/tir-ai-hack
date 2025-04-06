"use server";

import { createClient } from "@/utils/supabase/server/createClient";

export async function getUserClasses() {

    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
        console.error("Error fetching user:", authError?.message || "No user or email found");
        return [];
    }

    const userEmail = user.email;

    const { data: profile, error } = await supabase
        .from("user_profiles")
        .select(`
        id,
        user_classes (
            class_id,
            classes (
            id,
            name,
            url
            )
        )
        `)
        .eq("email", userEmail)
        .single();


    if (error || !profile) {
        console.error("Error fetching profile:", error?.message || "No profile found");
        return [];
    }


    console.log(profile)
    const classItems = profile.user_classes
        .filter((uc: any) => uc.classes)
        .map((uc: any) => ({
        id: uc.classes.id,
        title: uc.classes.name,
        url: uc.classes.url || `/classes/${uc.classes.id}`,
        }));
    
    console.log(classItems)

    return classItems;
    }