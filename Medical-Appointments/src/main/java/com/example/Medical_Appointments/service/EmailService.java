package com.example.Medical_Appointments.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ================= GENERIC ACCOUNT EMAIL (HTML VERSION) =================
    public void sendAccountEmail(String toEmail, String name, String password, String role) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Philadelphia Hospital - Account Registration");

            helper.setText(
                    buildEmailContent(name, toEmail, password, role),
                    true // 🔥 ENABLE HTML
            );

            mailSender.send(message);

        } catch (MessagingException | MailException ex) {
            System.out.println("Email failed to send: " + ex.getMessage());
        }
    }

    // ================= HTML EMAIL TEMPLATE =================
    private String buildEmailContent(String name, String email, String password, String role) {

        return """
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .header {
            background-color: #0d6efd;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 30px;
            color: #333;
        }

        .info-box {
            background: #f1f5ff;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .label {
            font-weight: bold;
            color: #0d6efd;
        }

        .warning {
            background: #fff3cd;
            padding: 15px;
            border-left: 5px solid #ffc107;
            margin-top: 20px;
            border-radius: 5px;
            font-size: 14px;
        }

        .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #777;
            background: #f8f9fa;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 15px;
            background: #0d6efd;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>

<body>

<div class="container">

    <div class="header">
        <h2>Philadelphia Hospital System</h2>
        <p>Account Registration Confirmation</p>
    </div>

    <div class="content">

        <p>Dear <b>${name}</b>,</p>

        <p>Welcome to the <b>Philadelphia Hospital Management System</b>. Your account has been successfully created.</p>

        <div class="info-box">

            <p><span class="label">Full Name:</span> ${name}</p>
            <p><span class="label">Email:</span> ${email}</p>
            <p><span class="label">Role:</span> ${role}</p>
            <p><span class="label">Temporary Password:</span> ${password}</p>

        </div>

        <div class="warning">
            ⚠ <b>Security Notice:</b><br/>
            Please log in immediately and change your password to ensure account security.
        </div>

        <a class="btn" href="http://localhost:3000/login">Login to System</a>

    </div>

    <div class="footer">
        Philadelphia Hospital IT Department<br/>
        support@philadelphiahospital.com
    </div>

</div>

</body>
</html>
""".replace("${name}", name)
                .replace("${email}", email)
                .replace("${role}", role)
                .replace("${password}", password);
    }

    // ================= DOCTOR EMAIL =================
    public void sendDoctorEmail(String toEmail, String name, String password, String specialization) {
        sendAccountEmail(toEmail, "Dr. " + name + " (" + specialization + ")", password, "DOCTOR");
    }

    // ================= ADMIN EMAIL =================
    public void sendAdminEmail(String toEmail, String name, String password) {
        sendAccountEmail(toEmail, name, password, "ADMIN");
    }
}