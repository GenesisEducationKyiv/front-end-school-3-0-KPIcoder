import { cn } from "@/lib/utils";
import { Github, Twitter, Linkedin } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";

interface FooterProps {
  className?: string;
  appName?: string;
  children?: React.ReactNode;
  showSocials?: boolean;
  showLegalLinks?: boolean;
}

interface SocialLink {
  name: string;
  url: string;
  icon: ReactNode;
}

export default function Footer({ 
  className,
  appName = "Music Player",
  children,
  showSocials = true,
  showLegalLinks = true
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  const socialLinks: SocialLink[] = [
    {
      name: "GitHub",
      url: "https://github.com",
      icon: <Github className="h-4 w-4" />
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
      icon: <Twitter className="h-4 w-4" />
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: <Linkedin className="h-4 w-4" />
    }
  ];
  
  return (
    <footer className={cn("border-t py-4 bg-muted/40", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p>© {currentYear} {appName}. All rights reserved.</p>
            </div>
            
            {children && (
              <div className="flex items-center">
                {children}
              </div>
            )}
            
            {showSocials && (
              <div className="flex items-center space-x-2">
                {socialLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    asChild
                  >
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {showLegalLinks && (
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-muted-foreground pt-2 border-t border-muted">
              <a href="/terms" className="hover:underline flex items-center gap-1">
                Terms of Service
              </a>
              <a href="/privacy" className="hover:underline flex items-center gap-1">
                Privacy Policy
              </a>
              <a href="/cookies" className="hover:underline flex items-center gap-1">
                Cookie Policy
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
} 