// Users Service — CRUD + auth operations via Supabase
import { supabase } from '../utils/supabaseClient';
import { User } from '../types';

// Helper: convert DB row to User type
const rowToUser = (row: any): User => ({
  username: row.username,
  email: row.email || undefined,
  password: row.password,
  role: row.role || 'admin',
  securityQuestion: row.security_question,
  securityAnswer: row.security_answer,
  createdDate: row.created_date
});

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_date', { ascending: true });

  if (error) throw error;
  return (data || []).map(rowToUser);
};

// Find user by username (for login)
export const findUserByUsername = async (username: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data ? rowToUser(data) : null;
};

// Add a new user
export const addUserToDb = async (user: {
  username: string;
  email?: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
}): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      username: user.username,
      email: user.email || null,
      password: user.password,
      role: 'admin',
      security_question: user.securityQuestion,
      security_answer: user.securityAnswer.toLowerCase().trim()
    })
    .select()
    .single();

  if (error) throw error;
  return rowToUser(data);
};

// Update a user
export const updateUserInDb = async (
  originalUsername: string,
  updates: {
    email?: string;
    password?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }
): Promise<void> => {
  const updateData: any = {};
  if (updates.email !== undefined) updateData.email = updates.email || null;
  if (updates.password) updateData.password = updates.password;
  if (updates.securityQuestion) updateData.security_question = updates.securityQuestion;
  if (updates.securityAnswer) updateData.security_answer = updates.securityAnswer.toLowerCase().trim();

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('username', originalUsername);

  if (error) throw error;
};

// Delete a user
export const deleteUserFromDb = async (username: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('username', username);

  if (error) throw error;
};
