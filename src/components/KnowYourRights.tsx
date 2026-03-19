"use client";

import { useState } from "react";
import { Scale, ChevronDown, ChevronUp, Phone, Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import { UNIVERSAL_RIGHTS, DISCRIMINATION_SCENARIOS, LEGAL_CONTACTS } from "@/data/rights";

type View = "main" | "rights" | "discrimination" | "contacts";

export function KnowYourRights() {
  const [view, setView] = useState<View>("main");
  const [expandedRight, setExpandedRight] = useState<string | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  if (view === "rights") {
    return (
      <div>
        <button onClick={() => setView("main")} className="mb-4 flex items-center gap-1 text-[13px] font-semibold text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h2 className="mb-4 text-[18px] font-black text-gray-900">Your Patient Rights</h2>
        <div className="space-y-2">
          {UNIVERSAL_RIGHTS.map((right) => (
            <div key={right.id} className="rounded-2xl bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
              <button
                onClick={() => setExpandedRight(expandedRight === right.id ? null : right.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="text-2xl">{right.emoji}</span>
                <span className="flex-1 text-[14px] font-bold text-gray-800">{right.title}</span>
                {expandedRight === right.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>
              {expandedRight === right.id && (
                <div className="border-t border-gray-50 px-4 pb-4 pt-3 animate-fade-in">
                  <p className="text-[13px] leading-relaxed text-gray-600">{right.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "discrimination") {
    return (
      <div>
        <button onClick={() => setView("main")} className="mb-4 flex items-center gap-1 text-[13px] font-semibold text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h2 className="mb-2 text-[18px] font-black text-gray-900">If You Face Discrimination</h2>
        <p className="mb-4 text-[13px] text-gray-500">Real situations and exactly what to say and do.</p>
        <div className="space-y-3">
          {DISCRIMINATION_SCENARIOS.map((scenario) => (
            <div key={scenario.id} className="rounded-2xl bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
              <button
                onClick={() => setExpandedScenario(expandedScenario === scenario.id ? null : scenario.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="text-2xl">{scenario.emoji}</span>
                <span className="flex-1 text-[14px] font-bold text-gray-800">{scenario.situation}</span>
                {expandedScenario === scenario.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>
              {expandedScenario === scenario.id && (
                <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3 animate-fade-in">
                  <div className="rounded-xl bg-blue-50 p-3 border border-blue-100">
                    <p className="text-[11px] font-black uppercase tracking-wider text-blue-600 mb-1">Say this:</p>
                    <p className="text-[13px] font-bold italic text-blue-800">{scenario.whatToSay}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Then do this:</p>
                    {scenario.whatToDo.map((step, i) => (
                      <div key={i} className="mb-1.5 flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C0392B] text-[10px] font-black text-white">{i + 1}</span>
                        <p className="text-[13px] text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "contacts") {
    return (
      <div>
        <button onClick={() => setView("main")} className="mb-4 flex items-center gap-1 text-[13px] font-semibold text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h2 className="mb-4 text-[18px] font-black text-gray-900">Legal Help by Country</h2>
        <div className="space-y-3">
          {LEGAL_CONTACTS.map((contact) => (
            <div key={contact.country} className="rounded-2xl bg-white p-4 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{contact.flag}</span>
                <span className="text-[15px] font-black text-gray-900">{contact.country}</span>
              </div>
              <div className="space-y-2">
                <div className="rounded-xl bg-gray-50 p-2.5">
                  <p className="text-[11px] font-bold text-gray-400">Patient Ombudsman</p>
                  <p className="text-[13px] font-semibold text-gray-800">{contact.ombudsman}</p>
                  {contact.ombudsmanPhone && (
                    <a href={`tel:${contact.ombudsmanPhone}`} className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-bold text-[#C0392B]">
                      <Phone className="h-3 w-3" /> {contact.ombudsmanPhone}
                    </a>
                  )}
                </div>
                <div className="rounded-xl bg-gray-50 p-2.5">
                  <p className="text-[11px] font-bold text-gray-400">Anti-Discrimination</p>
                  <p className="text-[13px] font-semibold text-gray-800">{contact.antiDiscrimination}</p>
                  {contact.antiDiscriminationPhone && (
                    <a href={`tel:${contact.antiDiscriminationPhone}`} className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-bold text-[#C0392B]">
                      <Phone className="h-3 w-3" /> {contact.antiDiscriminationPhone}
                    </a>
                  )}
                </div>
                {contact.romaRightsOrg && (
                  <div className="rounded-xl bg-red-50 p-2.5 border border-red-100">
                    <p className="text-[11px] font-bold text-red-400">Roma Rights Organization</p>
                    <p className="text-[13px] font-bold text-red-800">{contact.romaRightsOrg}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25">
          <Scale className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-[22px] font-black text-gray-900">Know Your Rights</h1>
        <p className="mt-2 text-[13px] text-gray-500">
          You have rights as a patient. Learn them. Use them.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setView("rights")}
          className="card-hover flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"
          style={{ border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-gray-900">Patient Rights</span>
            <p className="text-[12px] text-gray-500">8 rights every patient has</p>
          </div>
        </button>

        <button
          onClick={() => setView("discrimination")}
          className="card-hover flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"
          style={{ border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-gray-900">Facing Discrimination?</span>
            <p className="text-[12px] text-gray-500">What to say and do — step by step</p>
          </div>
        </button>

        <button
          onClick={() => setView("contacts")}
          className="card-hover flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"
          style={{ border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-gray-900">Legal Help by Country</span>
            <p className="text-[12px] text-gray-500">Ombudsman, anti-discrimination, Roma orgs</p>
          </div>
        </button>
      </div>
    </div>
  );
}
