"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/docs-mdx";
import { cn } from "@/lib/utils";

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 10.5v5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

type RtlLanguage = "en" | "ar" | "he";

const rtlCardTranslations: Record<
  RtlLanguage,
  {
    dir: "ltr" | "rtl";
    description: string;
    email: string;
    emailPlaceholder: string;
    forgotPassword: string;
    login: string;
    loginWithGoogle: string;
    password: string;
    signUp: string;
    title: string;
  }
> = {
  en: {
    dir: "ltr",
    description: "Enter your email below to login to your account",
    email: "Email",
    emailPlaceholder: "m@example.com",
    forgotPassword: "Forgot your password?",
    login: "Login",
    loginWithGoogle: "Login with Google",
    password: "Password",
    signUp: "Sign Up",
    title: "Login to your account",
  },
  ar: {
    dir: "rtl",
    description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "m@example.com",
    forgotPassword: "نسيت كلمة المرور؟",
    login: "تسجيل الدخول",
    loginWithGoogle: "تسجيل الدخول باستخدام Google",
    password: "كلمة المرور",
    signUp: "إنشاء حساب",
    title: "تسجيل الدخول إلى حسابك",
  },
  he: {
    dir: "rtl",
    description: "הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך",
    email: "אימייל",
    emailPlaceholder: "m@example.com",
    forgotPassword: "שכחת את הסיסמה?",
    login: "התחבר",
    loginWithGoogle: "התחבר עם Google",
    password: "סיסמה",
    signUp: "הירשם",
    title: "התחבר לחשבון שלך",
  },
};

function AccordionPreviewItem({
  answer,
  defaultOpen = false,
  disabled = false,
  question,
}: {
  answer: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  question: string;
}) {
  return (
    <details
      className={cn(
        "border-b last:border-b-0",
        disabled && "pointer-events-none opacity-50",
      )}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-left text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <ChevronDownIcon />
      </summary>
      <div className="pb-4 text-sm text-foreground/80">{answer}</div>
    </details>
  );
}

function renderAccordionPreview(name: string, direction: "ltr" | "rtl") {
  const faq = [
    {
      answer: "Yes. It adheres to the WAI-ARIA design pattern.",
      question: "Is it accessible?",
    },
    {
      answer: "Yes. It comes with default styles that match the other components.",
      question: "Is it styled?",
    },
    {
      answer: "Yes. It is animated by default, and you can adjust the treatment if needed.",
      question: "Is it animated?",
    },
  ];

  const longFaq = [
    {
      answer:
        "We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international orders.",
      question: "What are your shipping options?",
    },
    {
      answer: "Returns are accepted within 30 days if the item is unused and in its original packaging.",
      question: "What is your return policy?",
    },
    {
      answer: "You can reach support from the account dashboard or email support@example.com.",
      question: "How can I contact customer support?",
    },
  ];

  const content =
    name === "accordion-demo"
      ? faq
      : name === "accordion-multiple"
        ? [...faq, ...longFaq.slice(0, 1)]
        : name === "accordion-rtl"
          ? longFaq
          : faq;

  const accordion = (
    <div
      className={cn(
        "w-full max-w-sm rounded-xl bg-background",
        name === "accordion-borders" && "border px-4",
        name === "accordion-card" && "rounded-2xl border p-6 shadow-xs",
      )}
      data-slot="accordion"
      dir={direction}
    >
      {content.map((item, index) => (
        <AccordionPreviewItem
          key={`${name}-${item.question}`}
          answer={item.answer}
          defaultOpen={index === 0}
          disabled={name === "accordion-disabled" && index === 1}
          question={item.question}
        />
      ))}
    </div>
  );

  if (name === "accordion-card") {
    return accordion;
  }

  return <div className="grid w-full max-w-xl gap-4">{accordion}</div>;
}

function renderRtlCardPreview(language: RtlLanguage) {
  const t = rtlCardTranslations[language];

  return (
    <div
      dir={t.dir}
      className="mx-auto flex w-full max-w-[320px] flex-col gap-4 rounded-xl border bg-background p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
    >
      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <div className="text-base font-semibold">{t.title}</div>
            <div className="text-sm text-muted-foreground">{t.description}</div>
          </div>
          <button className="text-sm font-medium text-muted-foreground" type="button">
            {t.signUp}
          </button>
        </div>
      </div>
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">{t.email}</span>
          <input
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
            defaultValue=""
            placeholder={t.emailPlaceholder}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">{t.password}</span>
            <a className="text-xs text-muted-foreground" href="#forgot">
              {t.forgotPassword}
            </a>
          </div>
          <input className="h-10 rounded-md border bg-background px-3 text-sm outline-none" type="password" />
        </label>
      </div>
      <div className="grid gap-2">
        <Button className="w-full" type="button">
          {t.login}
        </Button>
        <Button className="w-full" type="button" variant="outline">
          {t.loginWithGoogle}
        </Button>
      </div>
    </div>
  );
}

function renderPreview(name: string, direction: "ltr" | "rtl", rtlLanguage: RtlLanguage) {
  if (name === "card-rtl") {
    return renderRtlCardPreview(rtlLanguage);
  }

  if (name.startsWith("accordion")) {
    return renderAccordionPreview(name, direction);
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
      Preview for <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[12px]">{name}</code> is still being wired in.
    </div>
  );
}

function RtlPreviewHeader({
  language,
  onLanguageChange,
}: {
  language: RtlLanguage;
  onLanguageChange: (language: RtlLanguage) => void;
}) {
  return (
    <div className="flex h-16 items-center border-b px-4">
      <label className="relative inline-flex items-center">
        <select
          aria-label="Choose preview language"
          className="h-8 appearance-none rounded-md border bg-background px-3 pr-8 text-sm text-foreground outline-none"
          onChange={(event) => onLanguageChange(event.target.value as RtlLanguage)}
          value={language}
        >
          <option value="ar">Arabic (العربية)</option>
          <option value="he">Hebrew (עברית)</option>
          <option value="en">English</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
          <ChevronDownIcon />
        </span>
      </label>
      <button
        className="ml-auto inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
        title="AI translation notice"
        type="button"
      >
        <InfoIcon />
      </button>
    </div>
  );
}

function renderCodeFigure(code: string) {
  return (
    <figure className="m-0" data-rehype-pretty-code-figure="">
      <CopyButton value={code} />
      <pre className="m-0 overflow-x-auto px-4 py-3.5">
        <code className="font-mono text-sm leading-6" data-language="tsx">
          {code}
        </code>
      </pre>
    </figure>
  );
}

export function ComponentPreviewClient({
  align = "center",
  caption,
  className,
  direction = "ltr",
  hideCode = false,
  name,
  previewClassName,
  previewSource,
  sourceCode,
}: {
  align?: "center" | "start" | "end";
  caption?: string;
  className?: string;
  direction?: "ltr" | "rtl";
  hideCode?: boolean;
  name: string;
  previewClassName?: string;
  previewSource: string;
  sourceCode: string;
}) {
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [rtlLanguage, setRtlLanguage] = useState<RtlLanguage>("ar");

  const previewContent = renderPreview(name, direction, rtlLanguage);
  const content = (
    <div
      className={cn(
        "group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-xl border",
        className,
      )}
      data-slot="component-preview"
    >
      {direction === "rtl" ? (
        <RtlPreviewHeader language={rtlLanguage} onLanguageChange={setRtlLanguage} />
      ) : null}

      <div data-slot="preview">
        <div
          className={cn(
            "preview relative flex h-72 w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start",
            previewClassName,
          )}
          data-align={align}
        >
          {previewContent}
        </div>
      </div>

      {hideCode ? null : (
        <div
          className="relative overflow-hidden border-t **:data-[slot=copy-button]:right-4 **:data-[slot=copy-button]:hidden data-[mobile-code-visible=true]:**:data-[slot=copy-button]:flex [&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
          data-mobile-code-visible={isCodeVisible}
          data-slot="code"
        >
          {isCodeVisible ? (
            <div className="component-preview-expanded">{renderCodeFigure(sourceCode)}</div>
          ) : (
            <div className="relative">
              {renderCodeFigure(previewSource)}
              <div
                className="absolute inset-0 flex items-center justify-center pb-4"
                style={{
                  background:
                    "linear-gradient(to top, var(--color-code), color-mix(in oklab, var(--color-code) 60%, transparent), transparent)",
                }}
              >
                <Button
                  className="relative z-10 rounded-lg bg-background text-foreground shadow-none hover:bg-muted"
                  onClick={() => setIsCodeVisible(true)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  View Code
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!caption) {
    return content;
  }

  return (
    <figure className="flex flex-col gap-4">
      {content}
      <figcaption className="-mt-8 text-center text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
