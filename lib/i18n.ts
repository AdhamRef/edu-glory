import "server-only"

const dictionaries = {
  en: () => import("@/locales/en.json").then((module) => module.default),
  ar: () => import("@/locales/ar.json").then((module) => module.default),
}

export type Locale = "en" | "ar"

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}

export const locales: Locale[] = ["ar", "en"]
export const defaultLocale: Locale = "ar"
