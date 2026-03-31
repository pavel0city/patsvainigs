export const metadata = {
  title: "diskleimeris | pats vainīgs",
};

export default function DisclaimerPage() {
  return (
    <div>
      <h1 className="page-title">diskleimeris</h1>

      <div className="disclaimer-page">
        <section className="disclaimer-section">
          <h2>ko te dara?</h2>
          <p>
            viss šajā blogā rakstītais ir autora subjektīvs viedoklis, pašironija un satīra.
            nekas no šeit publicētā nav domāts kā faktu apgalvojums, aicinājums uz darbību,
            vai mēģinājums kādu aizskart. ja esi aizvainots — pats vainīgs.
          </p>
        </section>

        <section className="disclaimer-section">
          <h2>Latvijas Republikas Satversme, 100. pants</h2>
          <p>
            Ikvienam ir tiesības uz vārda brīvību, kas ietver tiesības brīvi iegūt, paturēt
            un izplatīt informāciju, paust savus uzskatus. Cenzūra ir aizliegta.
          </p>
          <a
            href="https://likumi.lv/ta/id/57980-latvijas-republikas-satversme"
            target="_blank"
            rel="noopener noreferrer"
            className="disclaimer-page-link"
          >
            likumi.lv — Latvijas Republikas Satversme
          </a>
        </section>

        <section className="disclaimer-section">
          <h2>Eiropas Cilvēktiesību konvencija, 10. pants</h2>
          <p>
            Ikvienam ir tiesības brīvi paust savus uzskatus. Šīs tiesības ietver uzskatu
            brīvību un tiesības saņemt un izplatīt informāciju un idejas bez iejaukšanās no
            valsts institūciju puses un neatkarīgi no valstu robežām.
          </p>
          <p>
            Šīs tiesības attiecas arī uz darba attiecību kontekstu — darbinieka vārda brīvība
            nebeidzas brīdī, kad viņš ir nodarbināts.
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Article_10_of_the_European_Convention_on_Human_Rights"
            target="_blank"
            rel="noopener noreferrer"
            className="disclaimer-page-link"
          >
            Article 10, European Convention on Human Rights
          </a>
        </section>

        <section className="disclaimer-section">
          <h2>Herbai pret Ungāriju (ECHR, 2019)</h2>
          <p>
            Eiropas Cilvēktiesību tiesa lēma par labu darbiniekam, kurš tika atlaists par
            personīga bloga rakstīšanu. Tiesa noteica, ka vārda brīvība attiecas arī uz
            darba attiecībām, un darba devējam nav tiesību ierobežot darbinieka personīgo
            viedokļu paušanu ārpus darba laika.
          </p>
          <p>
            Tiesa izvērtē: runas raksturu, autora motīvus, faktisko kaitējumu darba devējam,
            un sankcijas smagumu. Pašironisks blogs par politiku un dzīvi vispār nav pamats
            disciplinārai sodīšanai.
          </p>
          <a
            href="https://eulawlive.com/blog/2019/11/11/blogging-on-professional-matters-after-work-strasbourg-strikes-a-balance-in-herbai-v-hungary/"
            target="_blank"
            rel="noopener noreferrer"
            className="disclaimer-page-link"
          >
            EU Law Live — Herbai v. Hungary
          </a>
        </section>
      </div>
    </div>
  );
}
