#!/usr/bin/env python3
import json
import time
import socket
from pathlib import Path
from deep_translator import GoogleTranslator

# Set a socket timeout of 10 seconds to prevent indefinite hanging on network requests
socket.setdefaulttimeout(10.0)

ROOT = Path(__file__).resolve().parent.parent
MESSAGES_DIR = ROOT / "messages"

ENGLISH_KEYS = {
    "title": "Mediator Dashboard",
    "subtitle": "Supporting your community's health",
    "ecHint": "Built for community health mediators in rural Romania — POIDS / FSE+ integrated community teams (ECI).",
    "accessCode": "Enter access code",
    "accessCodePlaceholder": "4-digit code",
    "accessCodeHint": "Ask your coordinator for the access code.",
    "accessCodeError": "Incorrect code. Please try again.",
    "accessCodeSubmit": "Access dashboard",
    "tabDashboard": "Overview",
    "tabCases": "Cases",
    "tabSessions": "Sessions",
    "tabIndicators": "Indicators",
    "tabTraining": "Training",
    "tabTools": "Field Tools",
    "communityMembers": "Tracked people",
    "logsThisMonth": "Visits this month",
    "openCases": "Active cases",
    "sessionsThisMonth": "Sessions this month",
    "quickActions": "Quick actions",
    "logVisit": "Log home visit",
    "newCase": "New case",
    "newSession": "Log information session",
    "recentActivity": "Recent visits",
    "noActivity": "No visits recorded yet.",
    "memberName": "Beneficiary (name or code)",
    "visitDate": "Visit date",
    "notes": "Visit notes",
    "saveVisit": "Save visit",
    "visitSaved": "Visit saved successfully",
    "casesTitle": "Case Management",
    "noCases": "No cases yet — add a family or person you support.",
    "caseName": "Beneficiary",
    "caseCategory": "Domain",
    "caseStatus": "Status",
    "caseNotes": "Intervention plan and notes",
    "nextVisit": "Next visit (optional)",
    "saveCase": "Save case",
    "caseSaved": "Case saved",
    "categoryHealth": "Health and prevention",
    "categorySocial": "Social support",
    "categoryEducation": "Education",
    "categoryRights": "Rights and access to care",
    "statusIdentified": "Identified",
    "statusAssessment": "Assessment",
    "statusPlan": "Intervention plan",
    "statusMonitoring": "Monitoring",
    "statusClosed": "Closed",
    "householdSize": "Household size",
    "vulnerabilityLabel": "Vulnerabilities (POIDS target group)",
    "healthFacilitationLabel": "Health facilitations",
    "sessionsTitle": "Information Sessions",
    "noSessions": "No sessions recorded yet.",
    "sessionTitle": "Session title",
    "sessionTopic": "Free topic",
    "sessionLocation": "Location (village, school, community center)",
    "sessionAttendees": "Attendees (approximate)",
    "sessionNotes": "Notes and follow-up",
    "sessionThemeLabel": "Public health theme",
    "saveSession": "Save session",
    "sessionSaved": "Session saved",
    "toolsTitle": "Use in the field with families",
    "toolsScan": "Debunk a health myth",
    "toolsVaccines": "Vaccine guide",
    "toolsRights": "Know your rights",
    "toolsExplain": "Explain a prescription",
    "toolsChat": "Ask health advisor",
    "contactSupport": "Contact county coordinator (UJSS)",
    "contactUjssGeneric": "Select county to load the UJSS coordinator.",
    "resources": "Resources",
    "downloadGuide": "Download the ECI field guide (PDF)",
    "countyLabel": "Your county",
    "countyPlaceholder": "Select county",
    "syncIdle": "Ready",
    "syncSyncing": "Syncing...",
    "syncSynced": "Synced",
    "syncOffline": "Device only",
    "exportPrint": "Print report (save as PDF)",
    "exportDownload": "Download HTML report",
    "reportTitle": "Health mediator activity report",
    "reportGenerated": "Generated at",
    "reportKpiSection": "Key indicators",
    "indicatorsTitle": "POIDS / SCI 2000 indicators",
    "indicatorsHint": "Automatically calculated from your cases, visits, and sessions. Use for UJSS / DSP monthly reporting.",
    "indicatorsCoverage": "Community coverage",
    "indicatorsActivity": "Field activity",
    "indicatorsHealthFacilitation": "Health facilitations (per case)",
    "indicatorsSessionsByTheme": "Sessions by theme (this year)",
    "indicatorsVulnerability": "Beneficiaries by vulnerable group",
    "indicatorsUniquePeople": "Unique beneficiaries",
    "indicatorsHouseholds": "People in households",
    "indicatorsClosedCases": "Closed cases",
    "indicatorsVisitsThisYear": "Visits (year to date)",
    "indicatorsAttendeesThisYear": "Session attendees (year)",
    "trainingTitle": "ECI Training",
    "trainingSubtitle": "Onboarding path for community nurses, mediators, and integrated team.",
    "trainingProgress": "Completed",
    "trainingMinutes": "min",
    "trainingCompleted": "completed",
    "trainingMarkComplete": "Mark as completed",
    "trainingMarkIncomplete": "Mark as incomplete",
    "trainingTierFoundations": "ECI Foundations",
    "trainingTierHealth": "Public health",
    "trainingTierSocial": "Social & rights",
    "trainingTierFieldwork": "Field activity",
    "vuln_child": "Children (0–18)",
    "vuln_schoolDropoutRisk": "School dropout risk",
    "vuln_pregnant": "Pregnant women",
    "vuln_singleParent": "Single parents",
    "vuln_minVeniturGarantat": "Guaranteed minimum income",
    "vuln_elderly": "Elderly",
    "vuln_disability": "People with disabilities",
    "vuln_romaCommunity": "Roma community",
    "vuln_noInsurance": "No health insurance",
    "vuln_noDocuments": "No ID documents",
    "vuln_domesticViolence": "Survivors of domestic violence",
    "facilitation_vaccinationFacilitated": "Vaccination facilitated",
    "facilitation_prenatalFacilitated": "Prenatal care facilitated",
    "facilitation_screeningReferral": "Screening referral",
    "facilitation_chronicMonitoring": "Chronic disease monitoring",
    "facilitation_tbCommunicableScreening": "TB / communicable disease screening",
    "facilitation_gpEnrollment": "GP enrollment",
    "facilitation_insuranceEnrollment": "Health insurance enrollment (CNAS)",
    "sessionTheme_vaccination": "Vaccination",
    "sessionTheme_maternalChild": "Maternal & child health",
    "sessionTheme_nutrition": "Nutrition & breastfeeding",
    "sessionTheme_hygiene": "Hygiene & sanitation",
    "sessionTheme_tbCommunicable": "TB & communicable diseases",
    "sessionTheme_chronicDisease": "Chronic diseases (HTA, diabetes)",
    "sessionTheme_screening": "Screening (cancer, NCDs)",
    "sessionTheme_mentalHealth": "Mental health",
    "sessionTheme_addiction": "Addictions (alcohol, drugs, smoking)",
    "sessionTheme_rights": "Rights & access to care",
    "sessionTheme_prevention": "General prevention",
    "sessionTheme_other": "Other",
    "roleBoundaryNotice": "Role boundary notice: As a community mediator/nurse, you support and facilitate access. Do not perform medical acts, diagnostics, or prescribe medications. Refer to clinical professionals for clinical decisions.",
    "dataMinimisationNote": "Data minimisation notice: Only record necessary details for continuity of care or program evaluation. Never enter full name and address combined, ethnicity, immigration status, or clinical diagnoses.",
    "consentAttestation": "I confirm that the person named (or the family member or guardian on their behalf) has agreed to this visit being recorded."
}

ROMANIAN_KEYS = {
    "title": "Spațiu de lucru mediator",
    "subtitle": "Gestionarea cazurilor, vizite la domiciliu și sesiuni informative pentru echipele integrate de comunitate.",
    "ecHint": "Construit pentru mediatorii sanitari comunitari din România rurală — echipe integrate de comunitate (ECI) POIDS / FSE+.",
    "accessCode": "Introdu codul de acces",
    "accessCodePlaceholder": "Cod din 4 cifre",
    "accessCodeHint": "Cere codul de acces de la coordonatorul tău ECI / județean (UJSS).",
    "accessCodeError": "Cod incorect. Încearcă din nou.",
    "accessCodeSubmit": "Deschide spațiul de lucru",
    "tabDashboard": "Prezentare generală",
    "tabCases": "Cazuri",
    "tabSessions": "Sesiuni",
    "tabIndicators": "Indicatori",
    "tabTraining": "Formare",
    "tabTools": "Instrumente de teren",
    "communityMembers": "Persoane urmărite",
    "logsThisMonth": "Vizite luna aceasta",
    "openCases": "Cazuri active",
    "sessionsThisMonth": "Sesiuni luna aceasta",
    "quickActions": "Acțiuni rapide",
    "logVisit": "Înregistrează vizită la domiciliu",
    "newCase": "Caz nou",
    "newSession": "Înregistrează sesiune informativă",
    "recentActivity": "Vizite recente",
    "noActivity": "Nicio vizită înregistrată încă.",
    "memberName": "Beneficiar (nume sau cod)",
    "visitDate": "Data vizitei",
    "notes": "Note vizită",
    "saveVisit": "Salvează vizita",
    "visitSaved": "Vizita salvată",
    "casesTitle": "Gestionarea cazurilor",
    "noCases": "Niciun caz încă — adaugă o familie sau persoană pe care o susții.",
    "caseName": "Beneficiar",
    "caseCategory": "Domeniu",
    "caseStatus": "Statut",
    "caseNotes": "Plan de intervenție și note",
    "nextVisit": "Următoarea vizită (opțional)",
    "saveCase": "Salvează cazul",
    "caseSaved": "Caz salvat",
    "categoryHealth": "Sănătate și prevenție",
    "categorySocial": "Suport social",
    "categoryEducation": "Educație",
    "categoryRights": "Drepturi și acces la îngrijire",
    "statusIdentified": "Identificat",
    "statusAssessment": "Evaluare",
    "statusPlan": "Plan de intervenție",
    "statusMonitoring": "Monitorizare",
    "statusClosed": "Închis",
    "householdSize": "Dimensiunea gospodăriei",
    "vulnerabilityLabel": "Vulnerabilități (grup țintă POIDS)",
    "healthFacilitationLabel": "Facilitări sanitare",
    "sessionsTitle": "Sesiuni informative",
    "noSessions": "Nicio sesiune înregistrată încă.",
    "sessionTitle": "Titlul sesiunii",
    "sessionTopic": "Subiect liber",
    "sessionLocation": "Locație (sat, școală, centru comunitar)",
    "sessionAttendees": "Participanți (aproximativ)",
    "sessionNotes": "Note și follow-up",
    "sessionThemeLabel": "Tema de sănătate publică",
    "saveSession": "Salvează sesiunea",
    "sessionSaved": "Sesiune salvată",
    "toolsTitle": "Folosește pe teren cu familiile",
    "toolsScan": "Demontează un mit de sănătate",
    "toolsVaccines": "Ghid de vaccinuri",
    "toolsRights": "Cunoaște-ți drepturile",
    "toolsExplain": "Explică o prescripție",
    "toolsChat": "Întreabă consilierul sanitar",
    "contactSupport": "Contactează coordonatorul județean (UJSS)",
    "contactUjssGeneric": "Selectează județul pentru a încărca coordonatorul UJSS.",
    "resources": "Resurse",
    "downloadGuide": "Descarcă ghidul ECI de teren (PDF)",
    "countyLabel": "Județul tău",
    "countyPlaceholder": "Selectează județul",
    "syncIdle": "Gata",
    "syncSyncing": "Sincronizare…",
    "syncSynced": "Sincronizat",
    "syncOffline": "Doar pe dispozitiv",
    "exportPrint": "Tipărește raport (salvează ca PDF)",
    "exportDownload": "Descarcă raport HTML",
    "reportTitle": "Raport de activitate mediator sanitar",
    "reportGenerated": "Generat la",
    "reportKpiSection": "Indicatori cheie",
    "indicatorsTitle": "Indicatori POIDS / SCI 2000",
    "indicatorsHint": "Calculați automat din cazurile, vizitele și sesiunile tale. Utilizează pentru raportarea lunară UJSS / DSP.",
    "indicatorsCoverage": "Acoperire comunitară",
    "indicatorsActivity": "Activitate de teren",
    "indicatorsHealthFacilitation": "Facilitări sanitare (per caz)",
    "indicatorsSessionsByTheme": "Sesiuni pe temă (anul acesta)",
    "indicatorsVulnerability": "Beneficiari pe grup vulnerabil",
    "indicatorsUniquePeople": "Beneficiari unici",
    "indicatorsHouseholds": "Persoane în gospodării",
    "indicatorsClosedCases": "Cazuri închise",
    "indicatorsVisitsThisYear": "Vizite (de la începutul anului)",
    "indicatorsAttendeesThisYear": "Participanți sesiuni (an)",
    "trainingTitle": "Formare ECI",
    "trainingSubtitle": "Cale de onboarding pentru asistenți medicali comunitari, mediatori și echipa integrată.",
    "trainingProgress": "Completat",
    "trainingMinutes": "min",
    "trainingCompleted": "completat",
    "trainingMarkComplete": "Marchează ca finalizat",
    "trainingMarkIncomplete": "Marchează ca nefinalizat",
    "trainingTierFoundations": "Fundamente ECI",
    "trainingTierHealth": "Sănătate publică",
    "trainingTierSocial": "Social și drepturi",
    "trainingTierFieldwork": "Activitate de teren",
    "vuln_child": "Copii (0–18)",
    "vuln_schoolDropoutRisk": "Risc abandon școlar",
    "vuln_pregnant": "Femei gravide",
    "vuln_singleParent": "Părinți singuri",
    "vuln_minVeniturGarantat": "Venit minim garantat",
    "vuln_elderly": "Vârstnici",
    "vuln_disability": "Persoane cu dizabilități",
    "vuln_romaCommunity": "Comunitate romă",
    "vuln_noInsurance": "Fără asigurare de sănătate",
    "vuln_noDocuments": "Fără acte de identitate",
    "vuln_domesticViolence": "Supraviețuitori ai violenței domestice",
    "facilitation_vaccinationFacilitated": "Vaccinare facilitată",
    "facilitation_prenatalFacilitated": "Îngrijire prenatală facilitată",
    "facilitation_screeningReferral": "Trimitere pentru screening",
    "facilitation_chronicMonitoring": "Monitorizare boli cronice",
    "facilitation_tbCommunicableScreening": "Screening TB / boli transmisibile",
    "facilitation_gpEnrollment": "Înscriere la medicul de familie",
    "facilitation_insuranceEnrollment": "Înscriere asigurare de sănătate (CNAS)",
    "sessionTheme_vaccination": "Vaccinare",
    "sessionTheme_maternalChild": "Sănătate maternă și infantilă",
    "sessionTheme_nutrition": "Nutriție și alăptare",
    "sessionTheme_hygiene": "Igienă și salubritate",
    "sessionTheme_tbCommunicable": "TB și boli transmisibile",
    "sessionTheme_chronicDisease": "Boli cronice (HTA, diabet)",
    "sessionTheme_screening": "Screening (cancer, boli netransmisibile)",
    "sessionTheme_mentalHealth": "Sănătate mintală",
    "sessionTheme_addiction": "Dependențe (alcool, droguri, fumat)",
    "sessionTheme_rights": "Drepturi și acces la îngrijire",
    "sessionTheme_prevention": "Prevenție generală",
    "sessionTheme_other": "Altele",
    "roleBoundaryNotice": "Notă privind granițele de rol: În calitate de mediator comunitar/asistent medical, oferiți sprijin și facilitați accesul. Nu efectuați acte medicale, diagnosticare și nu prescrieți medicamente. Adresați-vă profesioniștilor din domeniul clinic pentru decizii clinice.",
    "dataMinimisationNote": "Notă privind minimizarea datelor: Înregistrați doar detaliile necesare pentru continuitatea îngrijirii sau evaluarea programului. Nu introduceți niciodată numele complet împreună cu adresa, etnia, statutul de imigrare sau diagnosticele clinice.",
    "consentAttestation": "Confirm că persoana numită (sau un membru al familiei ori tutorele în numele acesteia) a fost de acord cu înregistrarea acestei vizite."
}

LOCALE_TARGETS = {
    "hu": "hu", "sk": "sk", "cs": "cs", "bg": "bg",
    "sr": "sr", "hr": "hr", "bs": "bs", "mk": "mk",
    "sl": "sl", "el": "el", "tr": "tr",
    "ro": "ro", "sq": "sq", "rom": "ro"
}

LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"]

def chunk_list(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def main():
    for locale in LOCALES:
        json_path = MESSAGES_DIR / f"{locale}.json"
        if not json_path.exists():
            print(f"File not found: {json_path}")
            continue
            
        print(f"Processing {locale}...")
        data = json.loads(json_path.read_text(encoding="utf-8"))
        
        if "mediator" not in data:
            data["mediator"] = {}
            
        if locale == "en":
            for k, v in ENGLISH_KEYS.items():
                data["mediator"][k] = v
        elif locale == "ro" or locale == "rom":
            for k, v in ROMANIAN_KEYS.items():
                data["mediator"][k] = v
        else:
            actual_lang = LOCALE_TARGETS.get(locale, locale)
            translator = GoogleTranslator(source="en", target=actual_lang)
            
            keys_to_translate = []
            vals_to_translate = []
            for k, v in ENGLISH_KEYS.items():
                if k in data["mediator"] and data["mediator"][k] != "" and data["mediator"][k] != v:
                    continue
                keys_to_translate.append(k)
                vals_to_translate.append(v)
                
            if vals_to_translate:
                print(f"  Translating {len(vals_to_translate)} keys chunk-mode (size 20) to {actual_lang}...")
                chunked_keys = list(chunk_list(keys_to_translate, 20))
                chunked_vals = list(chunk_list(vals_to_translate, 20))
                
                for idx, (keys_chunk, vals_chunk) in enumerate(zip(chunked_keys, chunked_vals)):
                    # Try batch translation first
                    try:
                        print(f"    Translating chunk {idx+1}/{len(chunked_keys)}...")
                        translated_chunk = translator.translate_batch(vals_chunk)
                        for k, val in zip(keys_chunk, translated_chunk):
                            data["mediator"][k] = val
                        time.sleep(0.5)
                    except Exception as e:
                        print(f"    Chunk {idx+1} failed: {e}. Falling back to key-by-key for this chunk...")
                        for k, v in zip(keys_chunk, vals_chunk):
                            # Ensure we don't hang by wrapping each translation in try/catch and small sleep
                            try:
                                translated_val = translator.translate(v)
                                data["mediator"][k] = translated_val
                            except Exception as inner_e:
                                print(f"      Failed {k}: {inner_e}")
                                data["mediator"][k] = v
                            time.sleep(0.1)
                        
        # Write back to file
        json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  Updated messages/{locale}.json successfully.")

if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    main()
