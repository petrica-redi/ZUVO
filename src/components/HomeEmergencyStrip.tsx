import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getEmergencyRegionForLocale } from "@/lib/locale-to-region";
import { getPrimaryEmergencyTel } from "@/lib/emergency-numbers";

type Props = { locale: string };

export async function HomeEmergencyStrip({ locale }: Props) {
  const t = await getTranslations("home");
  const region = getEmergencyRegionForLocale(locale);
  const tel = getPrimaryEmergencyTel(region);
  const display = tel === "127" && region === "albania" ? "127 / 112" : tel;
  return (
    <a
      href={`tel:${tel}`}
      className="flex items-center gap-3.5 rounded-2xl p-4 shadow-[0_4px_16px_rgba(220,38,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] active:scale-[0.99]"
      style={{ background: "linear-gradient(130deg, #ef4444 0%, #b91c1c 50%, #991b1b 100%)" }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/20">
        <Phone className="h-5 w-5 text-white" />
      </div>
      <div>
        <span className="text-[15px] font-black text-white">{t("emergencyTitle", { number: display })}</span>
        <p className="text-[12px] text-red-200">{t("emergencySubtitle")}</p>
      </div>
    </a>
  );
}
