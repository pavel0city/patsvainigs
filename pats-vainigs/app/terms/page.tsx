import { getAllTerms } from "@/app/lib/terms";

export const metadata = {
  title: "terminoloģija | pats vainīgs",
};

export default function TermsPage() {
  const terms = getAllTerms();

  if (terms.length === 0) {
    return (
      <div className="empty-state">
        <h2>terminu nav.</h2>
        <p>vēl nekas nav izskaidrots. kā parasti.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">terminoloģija</h1>
      <dl className="terms-list">
        {terms.map((term) => (
          <div key={term.id} className="terms-entry">
            <dt>{term.name}</dt>
            <dd>{term.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
