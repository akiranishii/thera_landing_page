import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { brand } from "@/config/brand";
import { footer } from "@/config/copy";

// Evaluated once at build time (the page is statically prerendered).
const year = new Date().getFullYear();

export function Footer() {
  const contactHref = brand.contactEmail ? `mailto:${brand.contactEmail}` : "#early-access";
  return (
    <footer className="border-t border-line bg-bg py-12 sm:py-16" aria-label="Footer">
      <Container>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Wordmark />
            <p className="mt-2 text-sm text-body">{brand.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {footer.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="rounded text-body transition-colors hover:text-heading">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={contactHref} className="rounded text-body transition-colors hover:text-heading">
                  {footer.contactLabel}
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="serif-emphasis text-base text-heading">{footer.phrase}</p>
          <p className="text-xs text-subtle">
            © {year} {brand.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
