import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '40');
    const academicYear = searchParams.get('academicYear');
    const major = searchParams.get('major');
    const classNumberStr = searchParams.get('classNumber');
    const classNumber = classNumberStr ? parseInt(classNumberStr) : undefined;

    if (!academicYear || !major || classNumber === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required params: academicYear, major, classNumber' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const students = await (prisma as any).user.findMany({
      where: {
        role: 'STUDENT',
        student: {
          class: { // Assume relation: user -> student -> class
            academicYear,
            major,
            classNumber,
          },
        },
      },
      include: {
        student: {
          select: {
            id: true,
            nis: true,
            class: {
              select: {
                academicYear: true,
                major: true,
                classNumber: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { student: { nis: 'asc' } },
    });

    const total = await (prisma as any).user.count({
      where: {
        role: 'STUDENT',
        student: {
          class: {
            academicYear,
            major,
            classNumber,
          },
        },
      },
    });

    // Map to match JSON: id=student.id, nis, class, user={name,email from user}
    const mappedStudents = students.map(s => ({
      id: s.student!.id,
      nis: s.student!.nis,
      class: s.student!.class,
      user: {
        name: s.name,
        email: s.email,
      },
    }));

    return NextResponse.json({
      success: true,
      message: 'Successfully get all student summary.',
      data: {
        students: mappedStudents,
        page,
        limit,
        total, // optional
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

