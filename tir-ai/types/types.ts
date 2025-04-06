// types.ts
export interface User {
    id: string; // UUIDs are strings in TypeScript
    email: string;
    username: string;
    created_at: string; // ISO timestamp string
    updated_at: string;
  }
  
  export interface Class {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface UserClass {
    id: string;
    user_id: string;
    class_id: string;
    created_at: string;
  }
  
  // For query results with joined data
  export interface UserClassWithClass extends UserClass {
    classes: Class;
  }