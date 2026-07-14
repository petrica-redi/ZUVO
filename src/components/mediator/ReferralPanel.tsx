"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar, CheckCircle, ClipboardList } from "lucide-react";
import {
  ATTENDANCE_OUTCOMES,
  type AttendanceOutcome,
  type AppointmentStatus,
} from "@/lib/operations/constants";
import type {
  Appointment,
  NavigationCase,
  OperationalProvider,
  Referral,
} from "@/lib/operations/types";
import type {
  CreateAppointmentInput,
  CreateReferralInput,
} from "@/lib/operations/types";
import { FormCard, SaveButton } from "./parts";

export function ReferralPanel({
  navCase,
  provider,
  referrals,
  appointments,
  onCreateReferral,
  onCreateAppointment,
  onConfirmAppointment,
  onRecordAttendance,
}: {
  navCase: NavigationCase;
  provider: OperationalProvider;
  referrals: Referral[];
  appointments: Appointment[];
  onCreateReferral: (input: CreateReferralInput) => Promise<Referral | null>;
  onCreateAppointment: (input: CreateAppointmentInput) => Promise<Appointment | null>;
  onConfirmAppointment: (appointmentId: string) => Promise<void>;
  onRecordAttendance: (
    appointmentId: string,
    outcome: AttendanceOutcome,
    followUpRequired: boolean,
    notes?: string,
  ) => Promise<void>;
}) {
  const t = useTranslations("operations");
  const [purpose, setPurpose] = useState(navCase.mainProblem);
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [accompaniment, setAccompaniment] = useState(false);
  const [interpretation, setInterpretation] = useState(
    navCase.barriers?.includes("language") ?? false,
  );
  const [saved, setSaved] = useState<"referral" | "appointment" | null>(null);
  const [selectedAppt, setSelectedAppt] = useState<string | null>(null);
  const [attendanceOutcome, setAttendanceOutcome] = useState<AttendanceOutcome>("attended");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [attendanceNotes, setAttendanceNotes] = useState("");

  const caseReferrals = referrals.filter((r) => r.caseId === navCase.id);
  const caseAppointments = appointments.filter((a) => a.caseId === navCase.id);
  const latestReferral = caseReferrals[0];

  const submitReferral = async () => {
    const result = await onCreateReferral({
      caseId: navCase.id,
      providerId: provider.id,
      purpose: purpose.trim(),
      notes: notes.trim(),
      scheduledFollowUp: followUpDate || undefined,
    });
    if (result) {
      setSaved("referral");
      setTimeout(() => setSaved(null), 1500);
    }
  };

  const submitAppointment = async () => {
    if (!apptDate) return;
    const result = await onCreateAppointment({
      caseId: navCase.id,
      providerId: provider.id,
      referralId: latestReferral?.id,
      appointmentDate: apptDate,
      appointmentTime: apptTime || undefined,
      location: provider.address,
      accompanimentRequired: accompaniment,
      interpretationRequired: interpretation,
      notes: notes.trim(),
    });
    if (result) {
      setSaved("appointment");
      setTimeout(() => setSaved(null), 1500);
    }
  };

  const submitAttendance = async () => {
    if (!selectedAppt) return;
    await onRecordAttendance(
      selectedAppt,
      attendanceOutcome,
      followUpRequired,
      attendanceNotes.trim() || undefined,
    );
    setSelectedAppt(null);
    setAttendanceNotes("");
  };

  return (
    <div className="flex flex-col gap-4">
      <FormCard>
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-[var(--color-sage-700)]" />
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            {t("createReferral")}
          </h3>
        </div>
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">
          {t("referralTo")}: <strong>{provider.name}</strong>
        </p>

        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder={t("referralPurpose")}
          aria-label={t("referralPurpose")}
          className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
        />

        <input
          type="date"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
          aria-label={t("referralFollowUp")}
          className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("referralNotes")}
          aria-label={t("referralNotes")}
          rows={2}
          className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
        />

        <SaveButton
          saved={saved === "referral"}
          savedLabel={t("referralSaved")}
          saveLabel={t("saveReferral")}
          disabled={!purpose.trim()}
          onClick={() => void submitReferral()}
        />
      </FormCard>

      {caseReferrals.length > 0 && (
        <div className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
          <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
            {t("existingReferrals")}
          </h4>
          <ul className="flex flex-col gap-2">
            {caseReferrals.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-[var(--color-border-subtle)] p-3 text-sm"
              >
                <span className="font-bold">{r.referralNumber}</span>
                <span className="ml-2 rounded-full bg-[var(--color-sage-100)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-sage-800)]">
                  {t(`referralStatus_${r.status}` as Parameters<typeof t>[0])}
                </span>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{r.purpose}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FormCard>
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[var(--color-sage-700)]" />
          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
            {t("scheduleAppointment")}
          </h3>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <input
            type="date"
            value={apptDate}
            onChange={(e) => setApptDate(e.target.value)}
            aria-label={t("appointmentDate")}
            className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />
          <input
            type="time"
            value={apptTime}
            onChange={(e) => setApptTime(e.target.value)}
            aria-label={t("appointmentTime")}
            className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />
        </div>

        <div className="mb-3 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={accompaniment}
              onChange={(e) => setAccompaniment(e.target.checked)}
              className="rounded"
            />
            {t("accompanimentRequired")}
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={interpretation}
              onChange={(e) => setInterpretation(e.target.checked)}
              className="rounded"
            />
            {t("interpretationRequired")}
          </label>
        </div>

        <SaveButton
          saved={saved === "appointment"}
          savedLabel={t("appointmentSaved")}
          saveLabel={t("saveAppointment")}
          disabled={!apptDate}
          onClick={() => void submitAppointment()}
        />
      </FormCard>

      {caseAppointments.length > 0 && (
        <div className="rounded-2xl bg-[var(--color-surface)] p-4 shadow-1">
          <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
            {t("existingAppointments")}
          </h4>
          <ul className="flex flex-col gap-2">
            {caseAppointments.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-[var(--color-border-subtle)] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">
                      {a.appointmentDate}
                      {a.appointmentTime ? ` · ${a.appointmentTime}` : ""}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {a.providerName ?? provider.name}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-sage-100)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-sage-800)]">
                    {t(`appointmentStatus_${a.status}` as Parameters<typeof t>[0])}
                  </span>
                </div>

                {(["requested", "reminder_sent"] as AppointmentStatus[]).includes(
                  a.status as AppointmentStatus,
                ) && (
                  <button
                    type="button"
                    onClick={() => void onConfirmAppointment(a.id)}
                    className="mt-2 flex items-center gap-1 rounded-full border border-[var(--color-sage-600)] px-3 py-1 text-[10px] font-bold text-[var(--color-sage-800)]"
                  >
                    <CheckCircle className="h-3 w-3" />
                    {t("confirmAppointment")}
                  </button>
                )}

                {(["confirmed", "reminder_sent"] as AppointmentStatus[]).includes(
                  a.status as AppointmentStatus,
                ) && (
                  <button
                    type="button"
                    onClick={() => setSelectedAppt(a.id)}
                    className="mt-2 rounded-full bg-[var(--color-sage-700)] px-3 py-1 text-[10px] font-bold text-white"
                  >
                    {t("recordAttendance")}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedAppt && (
        <FormCard>
          <h4 className="mb-3 text-sm font-bold text-[var(--color-text-primary)]">
            {t("attendanceFollowUp")}
          </h4>

          <select
            value={attendanceOutcome}
            onChange={(e) => setAttendanceOutcome(e.target.value as AttendanceOutcome)}
            aria-label={t("attendanceOutcome")}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          >
            {ATTENDANCE_OUTCOMES.map((o) => (
              <option key={o} value={o}>
                {t(`attendance_${o}` as Parameters<typeof t>[0])}
              </option>
            ))}
          </select>

          <label className="mb-3 flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={followUpRequired}
              onChange={(e) => setFollowUpRequired(e.target.checked)}
              className="rounded"
            />
            {t("followUpRequired")}
          </label>

          <textarea
            value={attendanceNotes}
            onChange={(e) => setAttendanceNotes(e.target.value)}
            placeholder={t("attendanceNotes")}
            aria-label={t("attendanceNotes")}
            rows={2}
            className="mb-3 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] p-3 text-sm"
          />

          <SaveButton
            saved={false}
            savedLabel={t("attendanceSaved")}
            saveLabel={t("saveAttendance")}
            disabled={false}
            onClick={() => void submitAttendance()}
          />
        </FormCard>
      )}
    </div>
  );
}
