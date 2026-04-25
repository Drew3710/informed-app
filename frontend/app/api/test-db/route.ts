import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('elections')
      .select('*')
      .limit(1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Supabase connection working!',
      data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Supabase connection failed',
        error: String(error),
      },
      { status: 500 }
    )
  }
}