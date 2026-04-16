# Nexis Flare - DNS Configuration

## Domain Information
- **Domain:** nexisflare.com
- **Registrar:** Namecheap
- **Account:** NexisFlare (dejczmandonat3@gmail.com)

## Manus Custom Domain Setup

Based on Manus Help Center documentation:
- Manus provides comprehensive support for custom domain connections for paid users
- Users can modify the subdomain of their deployed websites
- DNS records can be added through Manus Settings → Data controls → Manage

## DNS Configuration Steps

1. Access Manus Settings → Data controls
2. Find nexisflare.com and click "Manage"
3. Add DNS records as needed (A, CNAME, MX, TXT)
4. For subdomain "www", add a separate DNS record after connecting

## Next Steps
1. Access Manus webdev project settings
2. Navigate to Domains section
3. Connect nexisflare.com custom domain
4. Configure DNS records as provided by Manus
5. Verify DNS propagation

## Notes
- Domain purchases through Manus are non-refundable
- Existing A records should be removed before adding new CNAME/A records
- TTL values can be set during record creation
