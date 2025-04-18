export const getResetPasswordTemplate = (username, resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
  <table width="100%" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" style="background-color: #ffffff; border-radius: 6px; padding: 40px;">
          <tr>
            <td align="center" style="color: #888; font-size: 20px; font-weight: bold; padding-bottom: 30px;">
              CtrlSeat
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; color: #333;">
              <p>Hi ${username},</p>
              <p>You recently requested to reset your password for your CtrlSeat account. Use the button below to reset it. <strong>This password reset is only valid for the next 30 minutes.</strong></p>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #28a745; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Reset your password
                </a>
              </p>

              <p>If you did not request a password reset, please ignore this email</p>

              <p>Thanks,<br />The CtrlSeat team</p>

              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />

              <p style="font-size: 14px; color: #555;">If you're having trouble with the button above, copy and paste the URL below into your web browser:</p>
              <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            </td>
          </tr>
        </table>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          CtrlSeat<br />1234 Street Rd.<br />Suite 1234
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`


export const getBookingConfirmationTemplate = ({ name, bookingId, movieTitle, screen, showtime, numberOfSeats, totalPrice, seats }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Booking Confirmation</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0;">
    <table width="100%" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" style="background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="font-size: 24px; font-weight: bold; color: #333; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                🎟️ CtrlSeat - Booking Confirmation
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 0; font-size: 16px; color: #444; line-height: 1.5;">
                <p>Hi ${name},</p>
                <p>Your booking has been successfully confirmed. Here are your ticket details:</p>
                
                <table width="100%" style="background-color: #f9f9f9; border-radius: 4px; padding: 15px; margin: 20px 0;">
                  <tr>
                    <td style="padding: 8px 0;"><strong>Booking ID:</strong></td>
                    <td>${bookingId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Movie:</strong></td>
                    <td>${movieTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Screen:</strong></td>
                    <td>${screen}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Showtime:</strong></td>
                    <td>${new Date(showtime).toLocaleString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Number of Seats:</strong></td>
                    <td>${numberOfSeats}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Total Paid:</strong></td>
                    <td>₹${totalPrice.toLocaleString('en-IN')}</td>
                  </tr>
                </table>
                
                <p>Please arrive at least 15 minutes before the showtime. Show this email or your booking ID at the counter to collect your tickets.</p>
                <p>Enjoy your movie experience! 🍿</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #777; text-align: center;">
                <p>— The CtrlSeat Team</p>
                <p style="margin-top: 15px;">
                  <a href="https://ctrlseat.com/contact" style="color: #3498db; text-decoration: none;">Contact Support</a> | 
                  <a href="https://ctrlseat.com/faq" style="color: #3498db; text-decoration: none;">FAQs</a>
                </p>
              </td>
            </tr>
          </table>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            CtrlSeat • 123 Movie Lane • Film City<br>
            This is an automated email. Please do not reply.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`
