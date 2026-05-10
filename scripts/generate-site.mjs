import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(
  await readFile(resolve(root, "data", "products.json"), "utf8"),
);
const siteName = "Creator Stack Guide";
const siteOrigin = globalThis.process?.env?.SITE_URL || "https://example.com";
const updated = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const csp =
  "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function breadcrumbLd(items) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteOrigin}/${item.path}`,
    })),
  });
}

function head({ title, description, path = "./index.html", extra = "" }) {
  const canonical = path.startsWith("http") ? path : `${siteOrigin}/${path.replace(/^\.\//, "")}`;
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | ${siteName}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta http-equiv="Content-Security-Policy" content="${escapeHtml(csp)}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:title" content="${escapeHtml(title)} | ${siteName}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta name="twitter:card" content="summary">
  <link rel="stylesheet" href="./styles.css">
  ${extra}
</head>`;
}

function list(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function paragraphs(items) {
  return items.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
}

function shortCommission(value) {
  return String(value).split(";")[0].replace(", reported by OpenAffiliate", "");
}

function tableRow(product, index) {
  return `
        <tr>
          <td><span class="rank">${index + 1}</span></td>
          <td>
            <a class="table-tool" href="#${escapeHtml(product.slug)}">${escapeHtml(product.name)}</a>
            <span>${escapeHtml(product.category)}</span>
          </td>
          <td>${escapeHtml(product.best_for)}</td>
          <td>${escapeHtml(shortCommission(product.commission))}</td>
          <td>${escapeHtml(product.approval)}</td>
          <td><a class="text-link" href="${escapeHtml(product.affiliate_url)}" rel="sponsored nofollow noopener">申込</a></td>
        </tr>`;
}

function card(product) {
  return `
    <article class="tool-card" id="${escapeHtml(product.slug)}">
      <div class="tool-card__top">
        <div>
          <p class="eyebrow">${escapeHtml(product.category)}</p>
          <h3>${escapeHtml(product.name)}</h3>
        </div>
        <span class="tool-badge">レビュー</span>
      </div>
      <p class="fit">向いている人: ${escapeHtml(product.best_for)}</p>
      <dl class="metrics">
        <div><dt>報酬</dt><dd>${escapeHtml(product.commission)}</dd></div>
        <div><dt>承認</dt><dd>${escapeHtml(product.approval)}</dd></div>
        <div><dt>Cookie</dt><dd>${escapeHtml(product.cookie)}</dd></div>
      </dl>
      <div class="columns">
        <section>
          <h4>強み</h4>
          <ul>${list(product.strengths)}</ul>
        </section>
        <section>
          <h4>注意点</h4>
          <ul>${list(product.watchouts)}</ul>
        </section>
      </div>
      <div class="actions">
        <a class="button secondary" href="./${escapeHtml(product.slug)}-review.html">個別記事</a>
        <a class="button primary" href="${escapeHtml(product.affiliate_url)}" rel="sponsored nofollow noopener">公式/申込リンク</a>
        <a class="button secondary" href="${escapeHtml(product.source_url)}" rel="noopener">条件を確認</a>
      </div>
    </article>`;
}

const productArticleNotes = {
  pictory: {
    verdict:
      "ブログ記事や台本をすでに持っているなら、Pictoryは最初に試しやすい候補です。ゼロから映像作品を作るツールというより、文章を短尺動画や解説動画へ変換するための道具として見ると判断しやすくなります。",
    readerProblem:
      "読者の悩みは「AI動画を作りたい」だけではありません。多くの場合は、記事や台本、ウェビナーなど手元にある素材を、YouTube ShortsやSNSに回せないかを知りたいはずです。Pictoryはその入口に置くと説明しやすいです。",
    bestUse: [
      "ブログ記事を動画化して、比較記事への導線を作る",
      "長い台本から短尺の解説素材を作る",
      "字幕付きのサンプル動画を作り、レビュー記事に載せる",
    ],
    notFit: [
      "リアルなアバター動画を作りたい",
      "映画のような生成映像を作りたい",
      "細かいカット編集までタイムラインで詰めたい",
    ],
    affiliateAngle:
      "紹介するなら「ブログ1本をShorts素材に変える」という変化を見せるのがわかりやすいです。完成動画だけでなく、元の文章、変換後の構成、手直しした箇所を並べると、読者が導入後の作業量を想像しやすくなります。",
  },
  heygen: {
    verdict:
      "顔出しをせずに説明動画を作りたい人には、HeyGenが候補になります。Pictoryのような記事変換ツールではなく、アバターが話す動画を作るツールとして切り分けると、読者の迷いを減らせます。",
    readerProblem:
      "顔出しはしたくない。でも、ただのスライド動画では信頼感が弱い。そう感じている人にとって、アバター動画はわかりやすい選択肢です。営業、研修、多言語展開のように、同じ説明を何度も使う場面と相性があります。",
    bestUse: [
      "顔出しなしのサービス説明動画を作る",
      "営業や研修の説明を動画化する",
      "多言語向けの動画展開を検討する",
    ],
    notFit: [
      "ブログ記事をそのまま短尺動画に変換したい",
      "毎日大量のSNS動画だけを低コストで作りたい",
      "アバター感が出る動画を避けたい",
    ],
    affiliateAngle:
      "紹介するなら、単に機能を並べるより「顔出しなしで説明動画を作りたい」という悩みから入る方が自然です。台本の良し悪しで動画の印象が大きく変わるため、サンプル台本と完成イメージをセットで見せると説得力が出ます。",
  },
  descript: {
    verdict:
      "動画や音声を文章のように編集したいなら、Descriptは検討しやすい候補です。AI動画生成そのものより、録画・録音した素材を短時間で整える編集ワークフローに強みがあります。",
    readerProblem:
      "動画編集でつまずきやすいのは、派手なエフェクトよりも、不要な間を切る、言い間違いを直す、字幕を整えるといった地味な作業です。Descriptはその負担を減らしたい人に向けて説明すると伝わりやすいです。",
    bestUse: [
      "YouTubeやポッドキャストの編集時間を短縮する",
      "録画した解説動画から短尺クリップを作る",
      "字幕や文字起こしを使ってレビュー素材を整理する",
    ],
    notFit: [
      "テキストだけから完成動画を作りたい",
      "AIアバターの説明動画を作りたい",
      "素材なしで映像生成を完結させたい",
    ],
    affiliateAngle:
      "紹介するなら、編集前後の時間差を見せるのが強いです。例えば、10分の録画をどこまで短くできたか、字幕修正に何分かかったかを記録すると、読者が自分の作業に置き換えやすくなります。",
  },
  hypernatural: {
    verdict:
      "ShortsやTikTok向けに短尺動画を作りたいなら、Hypernaturalは無料運用の最初の実験に向きます。長尺の本格制作ではなく、毎日投稿のための短い動画素材を作る道具として見るのが自然です。",
    readerProblem:
      "アフィリエイトでは、いきなり申込リンクを貼っても読者は動きにくいです。まず短尺動画で興味を作り、比較ページで不安を減らす流れが必要になります。Hypernaturalはその最初の動画作成に使いやすい候補です。",
    bestUse: [
      "Shorts、TikTok、Instagram向けの短尺動画を作る",
      "AIナレーションと字幕で比較動画の型を作る",
      "無料で投稿導線をテストする",
    ],
    notFit: [
      "長尺の研修動画を作りたい",
      "細かい映像演出をプロ品質で作り込みたい",
      "実写撮影中心の編集だけをしたい",
    ],
    affiliateAngle:
      "紹介するなら、実際に作った15秒サンプルを起点にするのが一番伝わります。テーマ、台本、生成結果、手直しポイントを並べると、読者が真似しやすい記事になります。",
  },
};

function productNote(product) {
  return productArticleNotes[product.slug] || {
    verdict: `${product.name}は${product.best_for}に向く候補です。公開情報を確認しながら、無料で試せる範囲から判断します。`,
    readerProblem: "まずは読者の用途と、無料で検証できる範囲が合っているかを確認します。",
    bestUse: product.strengths,
    notFit: product.watchouts,
    affiliateAngle: "紹介する前に、実際の画面、作例、制限を確認してから本文へ反映します。",
  };
}

const footer = `
  <footer class="site-footer">
    <div>
      <a class="brand footer-brand" href="./index.html">
        <span class="brand-mark" aria-hidden="true"></span>
        Creator Stack Guide
      </a>
      <p>AI動画制作ツールを、用途・報酬条件・運用しやすさで比較する小さなガイドです。</p>
    </div>
    <nav aria-label="Footer">
      <a href="./about.html">運営情報</a>
      <a href="./methodology.html">比較基準</a>
      <a href="./ai-policy.html">AI利用方針</a>
      <a href="./free-start.html">無料で始める</a>
      <a href="./affiliate-disclosure.html">広告表記</a>
      <a href="./privacy.html">プライバシー</a>
    </nav>
  </footer>`;

function pageShell({ title, description, path, body, extraHead = "" }) {
  return `<!doctype html>
<html lang="ja">
${head({ title, description, path, extra: extraHead })}
<body>
  <header class="site-header">
    <a class="brand" href="./index.html">
      <span class="brand-mark" aria-hidden="true"></span>
      Creator Stack Guide
    </a>
    <nav aria-label="Primary">
      <a href="./index.html#compare">比較</a>
      <a href="./index.html#tools">詳細</a>
      <a href="./methodology.html">比較基準</a>
      <a href="./free-start.html">無料で始める</a>
      <a href="./index.html#faq">FAQ</a>
    </nav>
  </header>
  <main class="prose-page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="./index.html">Home</a>
      <span>${escapeHtml(title)}</span>
    </nav>
${body}
  </main>
${footer}
</body>
</html>`;
}

function reviewPage(product) {
  const note = productNote(product);
  return pageShell({
    title: `${product.name}の向き不向き`,
    path: `./${product.slug}-review.html`,
    description: `${product.name}の向いている用途、報酬条件、注意点、無料で試す前の確認ポイントを整理。`,
    extraHead: breadcrumbLd([
      { name: "Home", path: "index.html" },
      { name: `${product.name}の向き不向き`, path: `${product.slug}-review.html` },
    ]) + jsonLd({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${product.name}の向き不向きと無料確認ポイント`,
      author: {
        "@type": "Organization",
        name: siteName,
      },
      dateModified: updated,
    }),
    body: `
    <article class="prose">
      <p class="eyebrow">Tool guide</p>
      <h1>${escapeHtml(product.name)}の向き不向きと無料確認ポイント</h1>
      <p class="lead">${escapeHtml(product.best_for)}向けの候補として、公開情報ベースで整理しています。この記事では、誰に向くか、どこに注意するか、無料で試すなら何を見るかを先に整理します。</p>
      <div class="article-summary">
        <strong>先に結論</strong>
        <p>${escapeHtml(note.verdict)}</p>
        <ul>
          <li>向いている人: ${escapeHtml(product.best_for)}</li>
          <li>最初に見る条件: ${escapeHtml(product.approval)}</li>
          <li>申込前の確認: 報酬条件、無料枠、商用利用、出力制限</li>
        </ul>
      </div>
      <div class="callout">
        <strong>実測前のメモ</strong>
        <p>このページは公開情報と比較軸をもとにした事前整理です。実際に触った結果、スクリーンショット、動画サンプルは追加検証後に追記します。</p>
      </div>
      <section>
        <h2>どんな悩みに向くか</h2>
        <p>${escapeHtml(note.readerProblem)}</p>
        <p>${escapeHtml(product.name)}を選ぶかどうかは、機能数よりも「自分の投稿や記事の流れに入れやすいか」で見た方が失敗しにくいです。</p>
      </section>
      <section>
        <h2>向いている使い方</h2>
        <ul>${list(note.bestUse)}</ul>
      </section>
      <section>
        <h2>公開情報で確認した条件</h2>
        <dl class="metrics prose-metrics">
          <div><dt>報酬</dt><dd>${escapeHtml(product.commission)}</dd></div>
          <div><dt>承認</dt><dd>${escapeHtml(product.approval)}</dd></div>
          <div><dt>Cookie</dt><dd>${escapeHtml(product.cookie)}</dd></div>
        </dl>
      </section>
      <section>
        <h2>強みとして見たいところ</h2>
        <ul>${list(product.strengths)}</ul>
      </section>
      <section>
        <h2>向かないケース</h2>
        <ul>${list(note.notFit)}</ul>
      </section>
      <section>
        <h2>紹介記事での見せ方</h2>
        <p>${escapeHtml(note.affiliateAngle)}</p>
        <p>機能を全部説明するより、読者の作業がどう短くなるか、申込前に何を確認すればよいかを具体的に書く方が読み進めやすくなります。</p>
      </section>
      <section>
        <h2>注意点</h2>
        <ul>${list(product.watchouts)}</ul>
      </section>
      <section>
        <h2>実測で追記する項目</h2>
        <ul>
          <li>無料プランで作れる動画の長さと制限</li>
          <li>15秒動画を作るまでにかかった時間</li>
          <li>日本語ナレーションや字幕の自然さ</li>
          <li>出力動画の透かし、画質、商用利用条件</li>
          <li>初心者が詰まりやすい操作</li>
        </ul>
      </section>
      <div class="actions">
        <a class="button primary" href="${escapeHtml(product.affiliate_url)}" rel="sponsored nofollow noopener">公式/申込リンク</a>
        <a class="button secondary" href="${escapeHtml(product.source_url)}" rel="noopener">条件を確認</a>
      </div>
    </article>`,
  });
}

const intentPages = [
  {
    file: "ai-video-tools-free.html",
    title: "無料で試せるAI動画ツール比較",
    description: "無料で始めたい人向けに、AI動画ツールを比較するときの見方と注意点を整理。",
    h1: "無料で試せるAI動画ツール比較",
    lead: "最初から有料契約をする必要はありません。まずは無料枠で、読者に見せられる作例と、記事に書ける実体験を作れるかを確認します。",
    summary:
      "無料プランで見るべきなのは、機能数ではなく「申込前の不安を減らせる証拠を作れるか」です。透かし、出力時間、商用利用、クレジットカード登録の有無を先に見ておくと、あとで記事を書き直す手間が減ります。",
    takeaways: [
      "無料枠はレビュー素材を作るための検証環境として使う",
      "読者には、できることだけでなく制限も書く",
      "無料で作った作例を比較ページとShortsの両方に使う",
    ],
    sections: [
      {
        heading: "無料枠で最初に見るべきこと",
        body: [
          "AI動画ツールの無料枠は、長く使い続けるためのプランというより、記事に必要な証拠を集める場所です。1本でも実際に作れれば、画面の流れ、出力のクセ、手直しが必要な箇所を書けます。",
          "特にアフィリエイト記事では、良いところだけを書くより、無料でどこまでできて、どこから有料になるのかを見せた方が信頼されます。",
        ],
        items: ["透かしの有無", "出力できる動画の長さ", "日本語字幕やナレーションの品質", "商用利用条件", "クレジットカード登録の有無"],
      },
      {
        heading: "無料で作った素材の使い道",
        body: [
          "作例は1回作って終わりではなく、比較ページ、個別レビュー、Shorts投稿で使い回します。文章だけの比較より、実際の出力例がある方が読者は判断しやすくなります。",
        ],
        items: ["Shorts用の比較動画を作る", "レビュー記事に載せるサンプルを作る", "操作画面のスクリーンショットを撮る", "失敗例や手直しポイントもメモする"],
      },
      {
        heading: "無料プランで注意すること",
        body: [
          "無料と書かれていても、出力に透かしが入る、生成回数が少ない、商用利用は有料のみ、といった制限があります。記事ではこの制限を隠さずに書いた方が、結果的に読者の信頼を得やすいです。",
        ],
        items: ["無料プランだけでは出力制限がある場合があります", "商用利用条件は必ず公式ページで確認してください", "使っていない機能を実体験として書かないでください"],
      },
    ],
  },
  {
    file: "pictory-vs-heygen.html",
    title: "PictoryとHeyGenはどっちが向いている？",
    description: "PictoryとHeyGenを、用途、紹介しやすさ、Shorts導線との相性で比較。",
    h1: "PictoryとHeyGenはどっちが向いている？",
    lead: "PictoryとHeyGenは、どちらもAI動画ツールですが役割はかなり違います。記事や台本を動画化したいのか、顔出しなしで人が話すような説明動画を作りたいのかで選び方が変わります。",
    summary:
      "文章を動画に変えたいならPictory、アバターで説明したいならHeyGenから見るのが自然です。比較するときは、機能の多さではなく、自分が作る動画の型に合っているかで判断します。",
    takeaways: [
      "Pictoryはブログや台本の再利用に向く",
      "HeyGenはアバター説明や多言語展開に向く",
      "どちらも作例を見せると成約前の不安を減らしやすい",
    ],
    sections: [
      {
        heading: "用途の違い",
        body: [
          "Pictoryは、すでにある文章や長めの素材を動画へ変える方向に向いています。ブログ記事、台本、ウェビナーの内容を短くまとめる流れを作りたい人に説明しやすいです。",
          "HeyGenは、アバターが話す動画を作る方向に向いています。顔出しせずに説明したい、研修や営業資料を動画化したい、多言語で同じ内容を届けたい、という悩みから入ると自然です。",
        ],
        items: ["Pictory: ブログ記事や台本の動画化", "HeyGen: アバター解説、営業、研修、多言語動画"],
      },
      {
        heading: "アフィリエイト導線の違い",
        body: [
          "Pictoryは「この記事が動画になった」という変化を見せやすく、比較記事やShortsとの相性があります。HeyGenは「顔出ししなくても説明動画を作れる」という悩みに刺さりやすいです。",
          "どちらも、公式機能をなぞるだけでは弱いです。読者が知りたいのは、実際にどんな素材を入れて、どんな動画になり、どこを直したかです。",
        ],
        items: ["Pictoryは記事から動画への変換例を見せやすい", "HeyGenは顔出しなし動画の悩みに刺さりやすい", "どちらも実際の生成例があると成約前の不安を減らしやすい"],
      },
      {
        heading: "最初の選び方",
        body: [
          "迷ったら、先に自分が投稿する動画の型を決めます。文章を再利用する型ならPictory、話者が説明する型ならHeyGenです。報酬条件だけで選ぶと、記事の説得力が弱くなります。",
        ],
        items: ["無料で作れるサンプルの質を確認する", "自分のShortsテーマに合う方を優先する", "承認条件と報酬条件は申込前に確認する"],
      },
    ],
  },
  {
    file: "shorts-affiliate-workflow.html",
    title: "YouTube Shortsから比較ページへ送客する流れ",
    description: "広告費を使わず、ShortsからAI動画ツール比較ページへ誘導する無料運用フロー。",
    h1: "YouTube Shortsから比較ページへ送客する流れ",
    lead: "無料運用では、Shortsだけで売ろうとしません。Shortsで興味を作り、比較ページで申込前の不安を減らす流れを作ります。",
    summary:
      "Shortsは入口、比較ページは納得する場所です。15秒の動画ではすべてを説明できないので、動画では悩みをひとつだけ扱い、詳しい判断材料は比較ページに置きます。",
    takeaways: [
      "Shortsではひとつの悩みだけを扱う",
      "概要欄や固定コメントで比較ページへつなぐ",
      "比較ページでは条件、注意点、作例を見せる",
    ],
    sections: [
      {
        heading: "投稿テーマの作り方",
        body: [
          "最初から完璧なレビュー動画を作ろうとすると続きません。無料運用では、1本のShortsにつき悩みをひとつに絞ります。たとえば「顔出しなしで説明動画を作りたい」「ブログ記事を動画にしたい」のように、読者が自分ごとにしやすい切り口にします。",
        ],
        items: ["AとBどっち", "初心者が失敗しやすいポイント", "無料プランでできること", "作例ビフォーアフター"],
      },
      {
        heading: "概要欄の導線",
        body: [
          "Shortsの中で細かい条件まで説明すると、動画が重くなります。動画では興味を作り、概要欄や固定コメントで比較ページへ誘導します。比較ページには、報酬条件ではなく読者の判断材料を置くのが大事です。",
        ],
        items: ["最初の1行で比較ページの価値を伝える", "広告リンクを含むことを明記する", "直接成果リンクだけでなく比較ページへ誘導する"],
      },
      {
        heading: "改善の見方",
        body: [
          "最初は再生数だけで判断しない方がいいです。比較ページへのクリック、読まれているテーマ、申込前に見られているページを見ながら、残すテーマと捨てるテーマを分けます。",
        ],
        items: ["クリックされるテーマを残す", "反応が薄い投稿はタイトルを変える", "比較ページで読まれている箇所を増やす"],
      },
    ],
  },
];

function contentSection(section) {
  if (Array.isArray(section)) {
    const [heading, items] = section;
    return `<section>
        <h2>${escapeHtml(heading)}</h2>
        <ul>${list(items)}</ul>
      </section>`;
  }
  return `<section>
        <h2>${escapeHtml(section.heading)}</h2>
        ${paragraphs(section.body || [])}
        ${section.items?.length ? `<ul>${list(section.items)}</ul>` : ""}
      </section>`;
}

function intentPage(page) {
  const faq = [
    {
      q: "無料だけでSEOはできますか？",
      a: "できます。ただし短期で上位表示を保証するものではありません。無料公開、内部リンク、実体験の追加、継続更新を積み上げます。",
    },
    {
      q: "AIで作った文章はそのまま公開してよいですか？",
      a: "下書きとして使い、公式条件、実測結果、スクリーンショット、注意点を人間が確認してから公開する方針です。",
    },
  ];
  return pageShell({
    title: page.title,
    path: `./${page.file}`,
    description: page.description,
    extraHead: breadcrumbLd([
      { name: "Home", path: "index.html" },
      { name: page.title, path: page.file },
    ]) + jsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    }),
    body: `
    <article class="prose">
      <p class="eyebrow">SEO content hub</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lead">${escapeHtml(page.lead)}</p>
      <div class="article-summary">
        <strong>先に結論</strong>
        <p>${escapeHtml(page.summary)}</p>
        <ul>${list(page.takeaways)}</ul>
      </div>
      ${page.sections.map(contentSection).join("")}
      <section>
        <h2>関連ページ</h2>
        <ul>
          <li><a href="./index.html#compare">AI動画ツール比較表</a></li>
          <li><a href="./methodology.html">比較基準</a></li>
          <li><a href="./free-start.html">無料で始める手順</a></li>
        </ul>
      </section>
      <section>
        <h2>FAQ</h2>
        ${faq.map((item) => `<details><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`).join("")}
      </section>
    </article>`,
  });
}

const html = `<!doctype html>
<html lang="ja">
${head({
  title: "AI動画ツール比較",
  description: "YouTube ShortsやAI動画制作に使えるツールを、用途・報酬条件・注意点で比較。",
  path: "./index.html",
  extra: jsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: `${siteOrigin}/index.html`,
  }) + breadcrumbLd([{ name: "Home", path: "index.html" }]) + jsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI動画ツール比較",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteOrigin}/${product.slug}-review.html`,
      name: product.name,
    })),
  }),
})}
<body>
  <header class="site-header">
    <a class="brand" href="./index.html">
      <span class="brand-mark" aria-hidden="true"></span>
      Creator Stack Guide
    </a>
    <nav aria-label="Primary">
      <a href="#compare">比較</a>
      <a href="#tools">詳細</a>
      <a href="./methodology.html">比較基準</a>
      <a href="./about.html">運営情報</a>
      <a href="#workflow">運用</a>
      <a href="#faq">FAQ</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero__content">
        <p class="eyebrow">AI video affiliate stack</p>
        <h1>AI動画ツールを、<span>収益化目線で選ぶ。</span></h1>
        <p class="lead">最初に案件を選び、次に紹介材料を作り、最後にShortsから比較ページへ送客する。その順番で読めるように整理しています。</p>
        <div class="hero__actions">
          <a class="button primary" href="#compare">まず候補を選ぶ</a>
          <a class="button secondary" href="#roadmap">流れを見る</a>
        </div>
        <p class="disclosure">広告リンクを含みます。掲載条件は${updated}時点の公開情報をもとに確認し、申込前に公式ページで再確認してください。</p>
      </div>
      <div class="hero-preview" aria-label="Affiliate funnel preview">
        <div class="preview-top">
          <span>収益導線</span>
          <strong>最短公開の流れ</strong>
        </div>
        <div class="signal-row">
          <span class="signal active"></span>
          <span class="signal"></span>
          <span class="signal"></span>
          <span class="signal"></span>
        </div>
        <div class="preview-chart" aria-hidden="true">
          <span class="chart-bar chart-bar--1"></span>
          <span class="chart-bar chart-bar--2"></span>
          <span class="chart-bar chart-bar--3"></span>
          <span class="chart-bar chart-bar--4"></span>
          <span class="chart-bar chart-bar--5"></span>
        </div>
        <div class="preview-list">
          <div><span>01</span><strong>承認が早い案件から申請</strong></div>
          <div><span>02</span><strong>実レビューを比較表に反映</strong></div>
          <div><span>03</span><strong>Shortsから比較ページへ送客</strong></div>
        </div>
      </div>
    </section>

    <section class="roadmap" id="roadmap" aria-label="How to use this guide">
      <div>
        <span>Step 1</span>
        <strong>候補を比べる</strong>
        <p>比較表で、承認の早さ・用途・報酬条件をざっくり確認します。</p>
      </div>
      <div>
        <span>Step 2</span>
        <strong>申請する</strong>
        <p>無料で始められる案件から申請し、承認済みリンクだけを掲載します。</p>
      </div>
      <div>
        <span>Step 3</span>
        <strong>紹介材料を作る</strong>
        <p>案件詳細と個別記事で、記事やShortsに使う材料を集めます。</p>
      </div>
      <div>
        <span>Step 4</span>
        <strong>無料で送客する</strong>
        <p>検索導線と運用手順を使って、広告費なしで比較ページへ誘導します。</p>
      </div>
    </section>

    <section class="section section--compare" id="compare" data-section="01 候補を選ぶ">
      <div class="section__head">
        <p class="eyebrow">Choose</p>
        <h2>まず、申請する案件を絞る</h2>
        <p>最初は全部を深掘りせず、承認の早さ・用途・報酬条件で候補を選びます。</p>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>順位</th>
              <th>ツール</th>
              <th>向いている人</th>
              <th>報酬</th>
              <th>承認</th>
              <th>申込</th>
            </tr>
          </thead>
          <tbody>
${products.map(tableRow).join("\n")}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section section--tools muted-section" id="tools" data-section="02 紹介材料を作る">
      <div class="section__head">
        <p class="eyebrow">Prepare</p>
        <h2>次に、紹介で使う材料を集める</h2>
        <p>案件ごとの向き不向き、強み、注意点をレビュー記事やShorts台本へ転用できる形で整理しています。</p>
      </div>
      <div class="tool-grid">
${products.map(card).join("\n")}
      </div>
    </section>

    <section class="section section--hub muted-section" id="content-hub" data-section="03 検索流入を受ける">
      <div class="section__head">
        <p class="eyebrow">Attract</p>
        <h2>検索やSNSから来た人の受け皿を作る</h2>
        <p>比較表だけでは拾いきれない「無料で試したい」「AとBで迷う」「Shortsで送客したい」を個別ページで受け止めます。</p>
      </div>
      <div class="trust-grid">
        <a href="./ai-video-tools-free.html"><strong>無料で試せるAI動画ツール比較</strong><span>初期費用なしで検証する人向け</span></a>
        <a href="./pictory-vs-heygen.html"><strong>PictoryとHeyGenはどっち？</strong><span>用途別の選び方を整理</span></a>
        <a href="./shorts-affiliate-workflow.html"><strong>Shortsから送客する流れ</strong><span>広告費なしの導線設計</span></a>
      </div>
    </section>

    <section class="section section--workflow split" id="workflow" data-section="04 無料で回す">
      <div>
        <p class="eyebrow">Operate</p>
        <h2>無料で回す運用手順</h2>
      </div>
      <ol class="workflow">
        <li><strong>申請する</strong><span>公式/ASPに申請し、承認されたURLだけをdata/products.jsonへ貼る。</span></li>
        <li><strong>実例を作る</strong><span>無料プランで15秒サンプルを1本作り、スクショと所感を個別記事に追加する。</span></li>
        <li><strong>送客する</strong><span>「AとBどっち」「初心者におすすめ」「失敗例」の3型でShortsやSNSから比較ページへ誘導する。</span></li>
        <li><strong>更新する</strong><span>週1で報酬、cookie、承認条件を見直し、古い表記を直す。</span></li>
      </ol>
    </section>

    <section class="section section--trust evidence-section" id="trust" data-section="05 信頼性を補強">
      <div class="section__head">
        <p class="eyebrow">Trust</p>
        <h2>最後に、信頼性を補強する</h2>
        <p>AIで作った薄い比較ページに見えないよう、比較基準、AI利用方針、運営情報を分けて明記します。</p>
      </div>
      <div class="trust-grid">
        <a href="./methodology.html"><strong>比較基準</strong><span>順位づけと評価軸を明記</span></a>
        <a href="./ai-policy.html"><strong>AI利用方針</strong><span>AIの使い方と人間確認の範囲</span></a>
        <a href="./about.html"><strong>運営情報</strong><span>誰が、何のために作るか</span></a>
      </div>
    </section>

    <section class="section section--faq" id="faq" data-section="06 迷った時">
      <div class="section__head">
        <p class="eyebrow">FAQ</p>
        <h2>迷った時の確認ポイント</h2>
      </div>
      <div class="faq">
        <details open>
          <summary>最初に推すならどれ？</summary>
          <p>即時承認が期待できる案件から始め、実レビューを作りやすいツールを優先します。記事だけでなく、実際の生成動画を載せると成約前の不安を減らせます。</p>
        </details>
        <details>
          <summary>記事とShorts、どちらが早い？</summary>
          <p>短期の反応はShorts、検索からの継続流入は記事です。最短ではShortsからこの比較ページへ誘導し、検索向けに記事を育てます。</p>
        </details>
        <details>
          <summary>このサイトの次の改善は？</summary>
          <p>実測レビュー、価格表、動画サンプル、ランキング根拠、メール登録導線を追加します。特に実測レビューはAI生成だけの記事との差が出ます。</p>
        </details>
      </div>
    </section>
  </main>
${footer}
</body>
</html>
`;

await mkdir(resolve(root, "dist"), { recursive: true });
await writeFile(resolve(root, "dist", "index.html"), html, "utf8");
await writeFile(
  resolve(root, "dist", "about.html"),
  pageShell({
    title: "運営情報",
    path: "./about.html",
    description: "Creator Stack Guideの運営目的、編集方針、更新方針について。",
    body: `
    <article class="prose">
      <p class="eyebrow">About</p>
      <h1>運営情報</h1>
      <p class="lead">Creator Stack Guideは、AI動画制作ツールを無料スタート前提で比較する小さなガイドです。</p>
      <section>
        <h2>このサイトの目的</h2>
        <p>AI動画ツールを使ったShorts制作やアフィリエイト導線を、初期費用をかけずに検証するための情報を整理します。報酬条件だけでなく、承認の早さ、無料で試せる範囲、実レビューの作りやすさを重視します。</p>
      </section>
      <section>
        <h2>編集方針</h2>
        <ul>
          <li>公式ページや公開情報を確認し、更新日を明記します。</li>
          <li>実際に使っていない内容は、実測レビューとして断定しません。</li>
          <li>アフィリエイト報酬の有無だけでおすすめ順位を決めません。</li>
          <li>条件が変わる可能性があるため、申込前の公式確認を促します。</li>
        </ul>
      </section>
      <section>
        <h2>更新方針</h2>
        <p>報酬条件、cookie期間、承認条件は週次で確認します。実際に無料プランで検証できた内容は、個別レビューへ追記します。</p>
      </section>
    </article>`,
  }),
  "utf8",
);
await writeFile(
  resolve(root, "dist", "methodology.html"),
  pageShell({
    title: "比較基準",
    path: "./methodology.html",
    description: "AI動画ツール比較で使う評価軸、順位づけ、未検証項目の扱いについて。",
    extraHead: jsonLd({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "AI動画ツールの比較基準",
      dateModified: updated,
      author: { "@type": "Organization", name: siteName },
    }),
    body: `
    <article class="prose">
      <p class="eyebrow">Methodology</p>
      <h1>比較基準</h1>
      <p class="lead">このサイトでは、AI動画ツールを「無料で始めやすいか」「紹介しやすいか」「申込前の不安を減らせるか」で比較します。</p>
      <section>
        <h2>評価軸</h2>
        <ol>
          <li>承認スピード: すぐに検証を始められるか。</li>
          <li>報酬条件: recurring、cookie期間、最低支払額など。</li>
          <li>用途の明確さ: どんな読者にすすめるべきかが明確か。</li>
          <li>無料検証のしやすさ: 無料プランや無料トライアルでレビュー素材を作れるか。</li>
          <li>Shorts導線との相性: 短尺動画で説明しやすく、比較ページへ誘導しやすいか。</li>
        </ol>
      </section>
      <section>
        <h2>順位の考え方</h2>
        <p>順位は報酬率だけでは決めません。無料で始める段階では、承認の早さ、レビュー素材の作りやすさ、読者の悩みとの一致を優先します。</p>
      </section>
      <section>
        <h2>未検証項目の扱い</h2>
        <p>無料プランで未検証の機能、動画品質、商用利用条件は断定しません。実測前のページでは公開情報ベースであることを明記し、検証後に具体的な結果を追記します。</p>
      </section>
    </article>`,
  }),
  "utf8",
);
await writeFile(
  resolve(root, "dist", "ai-policy.html"),
  pageShell({
    title: "AI利用方針",
    path: "./ai-policy.html",
    description: "Creator Stack GuideでAIをどう使い、どこを人間が確認するかの方針。",
    body: `
    <article class="prose">
      <p class="eyebrow">AI policy</p>
      <h1>AI利用方針</h1>
      <p class="lead">このサイトでは、AIを構成作成、文章整理、HTML/CSS生成の補助に使います。ただし、公開前の条件確認、リンク差し替え、実測レビューは人間が確認します。</p>
      <section>
        <h2>AIを使う範囲</h2>
        <ul>
          <li>比較表の初期構成</li>
          <li>ページ構成と文章の下書き</li>
          <li>静的HTML/CSSの生成補助</li>
          <li>投稿テンプレの作成</li>
        </ul>
      </section>
      <section>
        <h2>人間が確認する範囲</h2>
        <ul>
          <li>公式ページの最新条件</li>
          <li>アフィリエイトリンクの正しさ</li>
          <li>無料プランでの実測結果</li>
          <li>スクリーンショットや動画サンプルの内容</li>
          <li>誇張表現や成果保証の有無</li>
        </ul>
      </section>
      <section>
        <h2>AI生成だけで公開しない理由</h2>
        <p>AIだけで作った薄い比較ページは、読者にも検索エンジンにも価値が伝わりにくくなります。そのため、実測結果、更新日、比較基準、注意点を追記して運用します。</p>
      </section>
    </article>`,
  }),
  "utf8",
);
await Promise.all(
  products.map((product) =>
    writeFile(resolve(root, "dist", `${product.slug}-review.html`), reviewPage(product), "utf8"),
  ),
);
await Promise.all(
  intentPages.map((page) => writeFile(resolve(root, "dist", page.file), intentPage(page), "utf8")),
);
await writeFile(
  resolve(root, "dist", "free-start.html"),
  pageShell({
    title: "無料で始めるAI動画アフィリエイト",
    path: "./free-start.html",
    description: "ドメイン代、サーバー代、広告費、有料ツール代をかけずにAI動画アフィリエイトを始める手順。",
    body: `
    <article class="prose">
      <p class="eyebrow">Free launch plan</p>
      <h1>無料だけで始めるAI動画アフィリエイト</h1>
      <p class="lead">最初はドメインも広告も有料ツールも使わず、無料ホスティングと無料投稿だけでテストします。</p>
      <section>
        <h2>最初にやること</h2>
        <ol>
          <li>このサイトをGitHub Pages、Cloudflare Pages、またはNetlify Freeに公開する。</li>
          <li>公開URLを媒体URLとして、無料で申請できるアフィリエイトに申し込む。</li>
          <li>承認されたリンクだけを <code>data/products.json</code> に貼る。</li>
          <li>Shorts、X、note、無料ブログから比較ページへ誘導する。</li>
        </ol>
      </section>
      <section>
        <h2>無料運用で使う導線</h2>
        <ul>
          <li>YouTube Shorts: 15秒の比較・失敗例・使い分け動画</li>
          <li>X: 使ってみた要点、比較表、更新メモ</li>
          <li>note/無料ブログ: 検索向けの補足記事</li>
          <li>このサイト: 申込前の最終比較ページ</li>
        </ul>
      </section>
      <section>
        <h2>まだやらないこと</h2>
        <ul>
          <li>広告出稿</li>
          <li>有料ドメイン購入</li>
          <li>有料サーバー契約</li>
          <li>複数の有料AIツール契約</li>
          <li>自動課金のある設定</li>
        </ul>
      </section>
      <div class="callout">
        <strong>公開前チェック</strong>
        <p>広告表記、リンクの <code>rel="sponsored nofollow"</code>、未承認リンクの扱い、条件更新日を確認してから公開します。</p>
      </div>
    </article>`,
  }),
  "utf8",
);
await writeFile(
  resolve(root, "dist", "affiliate-disclosure.html"),
  pageShell({
    title: "広告表記",
    path: "./affiliate-disclosure.html",
    description: "Creator Stack Guideの広告リンク、アフィリエイトリンク、掲載方針について。",
    body: `
    <article class="prose">
      <p class="eyebrow">Disclosure</p>
      <h1>広告表記</h1>
      <p>このサイトには広告リンク、アフィリエイトリンクが含まれます。リンク経由で申込や購入が発生した場合、運営者が報酬を受け取ることがあります。</p>
      <section>
        <h2>掲載方針</h2>
        <ul>
          <li>報酬条件だけで順位を決めず、用途・承認しやすさ・レビュー素材の作りやすさも見ます。</li>
          <li>報酬率、cookie期間、承認条件は変更されることがあります。</li>
          <li>申込前には必ず公式ページの最新条件を確認してください。</li>
        </ul>
      </section>
      <section>
        <h2>リンクの扱い</h2>
        <p>主要な広告リンクには <code>rel="sponsored nofollow"</code> を付けています。</p>
      </section>
    </article>`,
  }),
  "utf8",
);
await writeFile(
  resolve(root, "dist", "privacy.html"),
  pageShell({
    title: "プライバシーポリシー",
    path: "./privacy.html",
    description: "Creator Stack Guideのプライバシーポリシー。",
    body: `
    <article class="prose">
      <p class="eyebrow">Privacy</p>
      <h1>プライバシーポリシー</h1>
      <p>このサイトは、無料公開の静的サイトとして運用する前提です。現時点では問い合わせフォーム、会員登録、決済機能を設置していません。</p>
      <section>
        <h2>アクセス解析</h2>
        <p>現時点ではアクセス解析タグを設置していません。将来導入する場合は、このページに利用サービスと目的を追記します。</p>
      </section>
      <section>
        <h2>外部リンク</h2>
        <p>外部サイトへ移動した後の個人情報の取り扱いは、移動先サイトの規約やプライバシーポリシーに従います。</p>
      </section>
      <section>
        <h2>広告リンク</h2>
        <p>アフィリエイトリンクのクリックや申込に関する計測は、各アフィリエイトサービスや広告主の仕組みにより行われる場合があります。</p>
      </section>
    </article>`,
  }),
  "utf8",
);
await writeFile(
  resolve(root, "dist", "404.html"),
  pageShell({
    title: "ページが見つかりません",
    path: "./404.html",
    description: "ページが見つかりませんでした。",
    body: `
    <article class="prose">
      <p class="eyebrow">404</p>
      <h1>ページが見つかりません</h1>
      <p>URLが変わったか、ページがまだ作成されていません。</p>
      <p><a class="button primary" href="./index.html">トップへ戻る</a></p>
    </article>`,
  }),
  "utf8",
);
await writeFile(resolve(root, "dist", ".nojekyll"), "", "utf8");
await writeFile(
  resolve(root, "dist", "robots.txt"),
  `User-agent: *
Allow: /
Sitemap: ${siteOrigin}/sitemap.xml
`,
  "utf8",
);
const sitemapPaths = [
  "index.html",
  "free-start.html",
  "about.html",
  "methodology.html",
  "ai-policy.html",
  ...intentPages.map((page) => page.file),
  "affiliate-disclosure.html",
  "privacy.html",
  ...products.map((product) => `${product.slug}-review.html`),
];
await writeFile(
  resolve(root, "dist", "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths
  .map(
    (path) => `  <url>
    <loc>${siteOrigin}/${path}</loc>
    <lastmod>${updated}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
  "utf8",
);
await writeFile(
  resolve(root, "dist", "_headers"),
  `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: ${csp}
`,
  "utf8",
);
await writeFile(
  resolve(root, "dist", "llms.txt"),
  `# Creator Stack Guide

Creator Stack Guide is a small Japanese static site comparing AI video tools for creators who want to start with free hosting, no paid domain, and no ad spend.

Main pages:

- /index.html: AI video tool comparison table and affiliate disclosure.
- /free-start.html: Free launch plan.
- /methodology.html: Comparison methodology.
- /ai-policy.html: AI usage policy and human review policy.
- /about.html: Site purpose and editorial policy.
- /ai-video-tools-free.html: Free AI video tool comparison guide.
- /pictory-vs-heygen.html: Pictory vs HeyGen guide.
- /shorts-affiliate-workflow.html: YouTube Shorts traffic workflow.

Editorial policy:

- Public affiliate terms are checked before publishing.
- AI is used for drafts, structure, and static site generation.
- Human review is required for links, official terms, screenshots, and hands-on results.
- Draft review pages must not be presented as hands-on reviews until tested.
`,
  "utf8",
);
console.log("Generated dist/index.html");
