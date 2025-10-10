import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/notifications/email - Enviar email de notificación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, reservationId, recipientEmail, recipientName, customMessage } = body;

    // Validaciones básicas
    if (!type || !recipientEmail || !recipientName) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: type, recipientEmail, recipientName' },
        { status: 400 }
      );
    }

    // Obtener configuración del restaurante
    const settingsRecord = await prisma.restaurantSettings.findUnique({ 
      where: { id: 'settings-singleton' } 
    });
    const settings = (settingsRecord?.data as any) || {};

    // Verificar si las notificaciones por email están habilitadas
    if (!settings.notifications?.emailEnabled) {
      return NextResponse.json(
        { success: false, error: 'Las notificaciones por email están deshabilitadas' },
        { status: 400 }
      );
    }

    // Obtener detalles de la reserva si se proporciona ID
    let reservationDetails = null;
    if (reservationId) {
      reservationDetails = await prisma.reservation.findUnique({
        where: { id: reservationId },
        select: {
          id: true,
          customerName: true,
          date: true,
          time: true,
          guests: true,
          status: true,
        },
      });
    }

    // Construir contenido del email según el tipo
    let subject = '';
    let htmlContent = '';

    const restaurantName = settings.restaurantName || 'Restaurante';
    const restaurantEmail = settings.email || 'info@restaurante.com';
    const restaurantPhone = settings.phone || '+34 900 123 456';

    switch (type) {
      case 'confirmation':
        subject = `Confirmación de reserva en ${restaurantName}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Confirmación de Reserva</h2>
            <p>Estimado/a ${recipientName},</p>
            <p>Tu reserva ha sido <strong>confirmada</strong> con los siguientes detalles:</p>
            ${reservationDetails ? `
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Fecha:</strong> ${new Date(reservationDetails.date).toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> ${reservationDetails.time}</p>
                <p><strong>Comensales:</strong> ${reservationDetails.guests} personas</p>
                <p><strong>Estado:</strong> ${reservationDetails.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}</p>
              </div>
            ` : ''}
            <p>Por favor, llega 5 minutos antes de la hora reservada. Si necesitas modificar o cancelar tu reserva, contáctanos.</p>
            <p>¡Te esperamos!</p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 14px; color: #666;">
              <strong>${restaurantName}</strong><br>
              Teléfono: ${restaurantPhone}<br>
              Email: ${restaurantEmail}
            </p>
          </div>
        `;
        break;

      case 'reminder':
        subject = `Recordatorio de reserva en ${restaurantName}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Recordatorio de Reserva</h2>
            <p>Estimado/a ${recipientName},</p>
            <p>Te recordamos que tienes una reserva para hoy:</p>
            ${reservationDetails ? `
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Hora:</strong> ${reservationDetails.time}</p>
                <p><strong>Comensales:</strong> ${reservationDetails.guests} personas</p>
              </div>
            ` : ''}
            <p>Por favor, llega 5 minutos antes de la hora reservada. Si no puedes asistir, te agradeceríamos que nos lo comuniques.</p>
            <p>¡Te esperamos!</p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 14px; color: #666;">
              <strong>${restaurantName}</strong><br>
              Teléfono: ${restaurantPhone}<br>
              Email: ${restaurantEmail}
            </p>
          </div>
        `;
        break;

      case 'custom':
        subject = customMessage?.subject || `Mensaje de ${restaurantName}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Estimado/a ${recipientName},</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ${customMessage?.content || ''}
            </div>
            <hr style="margin: 30px 0;">
            <p style="font-size: 14px; color: #666;">
              <strong>${restaurantName}</strong><br>
              Teléfono: ${restaurantPhone}<br>
              Email: ${restaurantEmail}
            </p>
          </div>
        `;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de notificación no válido' },
          { status: 400 }
        );
    }

    // Simulación de envío de email
    // En una implementación real, aquí se integraría con un servicio como SendGrid, Nodemailer, etc.
    console.log('EMAIL ENVIADO (SIMULACIÓN):', {
      to: recipientEmail,
      subject,
      htmlContent,
      type,
      reservationId,
    });

    // Guardar registro de notificación enviada (opcional)
    // await prisma.notificationLog.create({
    //   data: {
    //     type,
    //     recipientEmail,
    //     recipientName,
    //     subject,
    //     content: htmlContent,
    //     reservationId,
    //     sentAt: new Date(),
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Email enviado correctamente (simulado)',
      details: {
        type,
        recipient: recipientEmail,
        subject,
      },
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar email' },
      { status: 500 }
    );
  }
}