const otpService = require('./service');
const customerService = require('../customers/service')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");

exports.sendEmail = async (email) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000)
        const otp = await otpService.getByEmail(email)
        if (otp) {
            await otpService.update(otp.email, code)
        } else {
            await otpService.insert({ email: email, code_otp: code })
        }
        sendOtp(email, code).catch(err => console.log(err))
        return { error: false, status: 200, message: 'Send success' }
    } catch (error) {
        return { error: true, status: 200, message: 'Error: ' + error }
    }
}


const sendOtp = async (email, code_otp) => {
    let chuoi_string = '' + code_otp
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'top59477@gmail.com',
            pass: 'nnxbbrtbsnidizci',
        },
    });
    await transporter.sendMail(
        {
            from: 'Laptop shop', // sender address
            to: `${email}`, // list of receivers
            subject: "Very Otp Lap top shop", // Subject line

            html: `<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Email Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

</head>
<style>
    .fa {
        padding: 20px;
        text-align: center;
        margin: 5px 2px;
        font-size: 30px;
        width: 30px;
        border-radius: 50%;
    }

    .fa-facebook {
        background: #3B5998;
        color: white;

    }

    .fa-twitter {
        background: #55ACEE;
        color: white;
    }



    .fa-instagram {
        background: #125688;
        color: white;
    }

    .fa-youtube {
        background: #bb0000;
        color: white;
    }





    .fa:hover {
        opacity: 0.9;
    }
</style>

<body style="background-color: #e9ecef;">


    <table border="0" cellpadding="0" cellspacing="0" width="100%">


        <tr>
            <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin-top: 30px;">
                    <tr>
                        <td align="center" bgcolor="black"
                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                            <div style="justify-content: center;">
                            <img style="position: relative; top: 7px;" width="25px" src="https://i.imgur.com/x5PSkQh.png">
                                <span
                                    style="font-size: 25px;font-weight: bold;color: #40BFFF;top: -10;position: relative;">Laptop shop</span>
                        </td>
                    </tr>
                    <tr>

                        <td align="left" bgcolor="#ffffff"
                            style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                            <div style="justify-content: center;">

                                <h1
                                    style="margin: 0; font-size: 25px; font-weight: 700; letter-spacing: -1px; line-height: 48px;font-weight: bold;">
                                    [Laptop shop] Verification
                                </h1>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>

        <tr>
            <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>

                        <td align="left" bgcolor="#ffffff"
                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                            <span style="font-weight: bold;">Hi !</span>
                            <p style="margin: 0;">Your verifycation code :</p>
                            <br>
                            <p style="margin: 0;font-weight: bold;color: #40BFFF;font-size: 20px;">${chuoi_string}
</p>

                        </td>
                    </tr>


                    <tr>
                        <td align="left" bgcolor="#ffffff"
                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                            <p style="margin: 0;">The verification code will be vaild for 30 minutes.Please do not share
                                this code with anyone . Don't recognize this activity? Please <span
                                    style="color: #40BFFF;">reset your password</span> and contact <span
                                    style="color: #40BFFF;">customer support</span> immediately.</p>
                            <br>
                            <p style="margin: 0;">This is an automated message,please do not reply</p>

                            <br>
                            <p style="margin: 0;">Thank you!,<br> Labtop shop security team</p>

                        </td>
                    </tr>

                    <tr>
                        <td align="center" bgcolor="#ffffff"
                            style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                            <p style="margin: 0;font-weight: bold;color: #40BFFF;">Stay Connected<br></p>
                            <hr style="background-color: #40BFFF; height: 2px;">
                            <br>
                            <div style="justify-content: center;">
                                <a href="#" class="fa fa-facebook"></a>
                                <a href="#" class="fa fa-twitter"></a>
                                <a href="#" class="fa fa-instagram"></a>
                                <a href="#" class="fa fa-youtube"></a>
                        </td>
                    </tr>


                </table>

            </td>
        </tr>

        <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                    <!-- start permission -->
                    <tr>
                        <td align="center" bgcolor="#e9ecef"
                            style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">You received this email because we received a request for
                                [Laptop shop] for your account. If you didn't request [Laptop shop] you can safely
                                delete this email.</p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" bgcolor="#e9ecef"
                            style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                            <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com"
                                    target="_blank">unsubscribe</a> at any time.</p>
                            <p style="margin: 0;">FPT POLYTECHNIC cơ sở Hồ Chí Minh</p>
                        </td>
                    </tr>


                </table>

            </td>
        </tr>


    </table>

</body>

</html>`

        }
    );
}

exports.verify = async (email, code_otp, newPassword) => {
    try {
        const otp = await otpService.getByEmail(email)
        if (!otp) return { error: false, status: 200, result_code: 0, mesage: 'Mã không đúng' }

        if (otp.code_otp !== Number(code_otp)) {
            return { error: false, status: 200, result_code: 0, mesage: 'Mã không đúng' }
        }
        const user = await customerService.getByEmail(email)
        const hasPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10))
        await customerService.updatePassword({ _id: user._id, password: hasPassword })
        await otpService.delete(otp._id)
        return { error: false, status: 200, result_code: 1, mesage: 'Change password success' }
    } catch (error) {
        return { error: true, status: 200, result_code: 0, mesage: 'error: ' + error }
    }
}



