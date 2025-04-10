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