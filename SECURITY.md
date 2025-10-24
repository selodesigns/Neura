# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Neura seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: selodev3d@gmail.com

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- You will receive an acknowledgment within 48 hours
- We will investigate and provide regular updates on our progress
- We will notify you when the issue is fixed
- We will publicly disclose the issue (giving you credit if desired) after a fix is released

## Security Best Practices

When deploying Neura, please ensure:

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, unique values for `JWT_SECRET`
   - Rotate API keys regularly
   - Use environment-specific configurations

2. **Database Security**
   - Use strong MongoDB passwords
   - Enable MongoDB authentication
   - Use network encryption (TLS/SSL)
   - Restrict database access by IP
   - Regular backups

3. **API Security**
   - Enable rate limiting in production
   - Use HTTPS/TLS for all connections
   - Implement request size limits
   - Validate and sanitize all inputs
   - Use CORS whitelist

4. **Authentication**
   - Enforce strong password policies
   - Use HTTPS for authentication endpoints
   - Implement account lockout after failed attempts
   - Use secure session management

5. **Application Security**
   - Keep dependencies up to date
   - Use `npm audit` regularly
   - Enable security headers
   - Implement CSP (Content Security Policy)
   - Use prepared statements for database queries

6. **Monitoring**
   - Enable logging for security events
   - Monitor for suspicious activity
   - Set up alerts for critical events
   - Regular security audits

## Security Updates

We will announce security updates through:
- GitHub Security Advisories
- Release notes
- Email notifications to registered users

## Disclosure Policy

When we learn of a security issue, we will:
1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible

## Bug Bounty

We currently do not have a formal bug bounty program, but we deeply appreciate any effort to discover and disclose security issues responsibly.

## Contact

For security concerns, contact: selodev3d@gmail.com
For general support, contact: selodev3d@gmail.com

**Created by SELODev**  
Website: https://selodev.com  
GitHub: https://github.com/selodesigns

## Acknowledgments

We would like to thank the following security researchers for responsibly disclosing vulnerabilities:

- (None yet - you could be first!)

Thank you for helping keep Neura and our users safe!
