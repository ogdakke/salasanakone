import { useTranslation } from "@/common/hooks/useLanguage"
import "@/styles/StorageIndicator.css"

export function StorageIndicator({ storage }: { storage: string }) {
  const { t } = useTranslation()

  return (
    <output title={t("storageUsedDesc", { storage: storage }).toString()} className="StorageUsed">
      <span className="CircleBackground" />
      {storage} {t("megaByte")}
    </output>
  )
}
