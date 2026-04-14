// Specials Service — CRUD operations via Supabase
import { supabase } from '../utils/supabaseClient';
import { Special } from '../types';

// Helper: convert DB row to Special type
const rowToSpecial = (row: any): Special => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  startDate: row.start_date,
  endDate: row.end_date,
  imageUrl: row.image_url,
  fileName: row.file_name || '',
  createdDate: row.created_date
});

// Get all specials
export const getSpecials = async (): Promise<Special[]> => {
  const { data, error } = await supabase
    .from('specials')
    .select('*')
    .order('created_date', { ascending: false });

  if (error) throw error;
  return (data || []).map(rowToSpecial);
};

// Upload image to Supabase Storage and return public URL
export const uploadSpecialImage = async (file: File): Promise<string> => {
  const fileName = `specials/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

// Convert image file to base64 data URL (fallback if Storage not set up)
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Add a new special
export const addSpecialToDb = async (
  data: { title: string; description: string; startDate: string; endDate: string },
  imageFile: File
): Promise<Special> => {
  // Try Supabase Storage first, fall back to base64
  let imageUrl: string;
  try {
    imageUrl = await uploadSpecialImage(imageFile);
  } catch {
    // Storage not configured — use base64 as fallback
    imageUrl = await fileToDataUrl(imageFile);
  }

  const { data: row, error } = await supabase
    .from('specials')
    .insert({
      title: data.title,
      description: data.description,
      start_date: data.startDate,
      end_date: data.endDate,
      image_url: imageUrl,
      file_name: imageFile.name
    })
    .select()
    .single();

  if (error) throw error;
  return rowToSpecial(row);
};

// Update an existing special
export const updateSpecialInDb = async (
  id: string,
  data: { title: string; description: string; startDate: string; endDate: string },
  imageFile?: File
): Promise<Special> => {
  const updateData: any = {
    title: data.title,
    description: data.description,
    start_date: data.startDate,
    end_date: data.endDate
  };

  if (imageFile) {
    try {
      updateData.image_url = await uploadSpecialImage(imageFile);
    } catch {
      updateData.image_url = await fileToDataUrl(imageFile);
    }
    updateData.file_name = imageFile.name;
  }

  const { data: row, error } = await supabase
    .from('specials')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return rowToSpecial(row);
};

// Delete a special
export const deleteSpecialFromDb = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('specials')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
