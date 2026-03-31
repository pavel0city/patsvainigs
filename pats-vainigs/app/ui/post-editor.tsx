"use client";

import { useRef, useState, useEffect } from "react";
import { checkTermExists, quickCreateTerm, fetchAllTermNames } from "@/app/actions/terms";

export default function PostEditor({
  defaultValue,
  placeholder,
}: {
  defaultValue?: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [modal, setModal] = useState<{ termName: string; selStart: number; selEnd: number } | null>(null);
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [definition, setDefinition] = useState("");
  const [existingTerms, setExistingTerms] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (modal) {
      fetchAllTermNames().then((terms) => {
        const names = terms.map((t) => t.name);
        setExistingTerms(names);
        if (names.length > 0) {
          setSelectedTerm(names[0]);
        }
      });
    }
  }, [modal]);

  function insertTerm(start: number, end: number, termName: string) {
    const ta = ref.current;
    if (!ta) return;
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    ta.value = before + "<t>" + termName + "</t> <c>" + after;
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function wrapSelection(prefix: string, suffix: string) {
    const ta = ref.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);

    if (!selected) return;

    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    ta.value = before + prefix + selected + suffix + after;

    ta.selectionStart = start + prefix.length;
    ta.selectionEnd = end + prefix.length;
    ta.focus();
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  }

  async function handleTermClick() {
    const ta = ref.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end).trim();

    if (!selected) return;

    const exists = await checkTermExists(selected);
    if (exists) {
      wrapSelection("<t>", "</t> <c>");
    } else {
      setModal({ termName: selected, selStart: start, selEnd: end });
      setMode("new");
      setDefinition("");
      setSelectedTerm("");
      setModalError("");
    }
  }

  async function handleCreateSubmit() {
    if (!modal) return;
    setSaving(true);
    setModalError("");

    const result = await quickCreateTerm(modal.termName, definition);
    if (result.error) {
      setModalError(result.error);
      setSaving(false);
      return;
    }

    insertTerm(modal.selStart, modal.selEnd, modal.termName);
    setSaving(false);
    setModal(null);
  }

  function handleExistingSubmit() {
    if (!modal || !selectedTerm) return;
    // Replace the highlighted text with the existing term name wrapped in <t>
    insertTerm(modal.selStart, modal.selEnd, selectedTerm);
    setModal(null);
  }

  return (
    <div className="form-field">
      <label htmlFor="content">content</label>
      <div className="editor-toolbar">
        <button type="button" onClick={handleTermClick}>
          term
        </button>
        <button type="button" onClick={() => wrapSelection("_", "_")}>
          italic
        </button>
      </div>
      <textarea
        ref={ref}
        id="content"
        name="content"
        required
        defaultValue={defaultValue}
        placeholder={placeholder}
      />

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              &quot;{modal.termName}&quot;
            </h3>

            <div className="modal-tabs">
              <button
                type="button"
                className={`modal-tab ${mode === "new" ? "active" : ""}`}
                onClick={() => setMode("new")}
              >
                create new
              </button>
              <button
                type="button"
                className={`modal-tab ${mode === "existing" ? "active" : ""}`}
                onClick={() => setMode("existing")}
                disabled={existingTerms.length === 0}
              >
                use existing ({existingTerms.length})
              </button>
            </div>

            {modalError && <p className="form-error">{modalError}</p>}

            {mode === "new" ? (
              <>
                <div className="form-field" style={{ marginTop: "0.75rem" }}>
                  <label htmlFor="modal-def">definition</label>
                  <textarea
                    id="modal-def"
                    rows={3}
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
                    placeholder="what does this mean?"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.metaKey) {
                        e.preventDefault();
                        handleCreateSubmit();
                      }
                    }}
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="form-submit"
                    onClick={handleCreateSubmit}
                    disabled={saving || !definition.trim()}
                  >
                    {saving ? "saving..." : "save & insert"}
                  </button>
                  <button type="button" className="link-btn" onClick={() => setModal(null)}>
                    cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-field" style={{ marginTop: "0.75rem" }}>
                  <label htmlFor="modal-existing">pick a term</label>
                  <select
                    id="modal-existing"
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                  >
                    {existingTerms.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="modal-subtitle" style={{ marginTop: "0.5rem" }}>
                  replaces &quot;{modal.termName}&quot; with &quot;{selectedTerm}&quot;
                </p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="form-submit"
                    onClick={handleExistingSubmit}
                    disabled={!selectedTerm}
                  >
                    insert
                  </button>
                  <button type="button" className="link-btn" onClick={() => setModal(null)}>
                    cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
