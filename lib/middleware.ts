import jwt from 'jsonwebtoken';
import { NextResponse, NextRequest } from 'next/server';

type TDecoded = {
  id: string,
  role: number,
}

export async function checkAuth(request: NextRequest, userId?: string): Promise<TDecoded | NextResponse>  {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Authentication token is missing' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '') as { id: string, role: number };
    if(userId && decoded.id !== userId) {
      return NextResponse.json({ message: "Not Allow!"}, { status: 403 });
    }
    return decoded;
  } catch (error) {
    return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
  }
}

export async function checkUserRole(request: NextRequest, allowedRoles: number[]) : Promise<NextResponse | null> {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Access token is missing' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '') as { role: number };
    
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }
    
    return null;
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
