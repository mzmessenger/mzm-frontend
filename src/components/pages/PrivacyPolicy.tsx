import React from 'react'
import styled from 'styled-components'
import Header from '../atoms/LoginHeader'

const PrivacyPolicy = () => {
  return (
    <Wrap>
      <Header />
      <div className="terms">
        <h2>プライバシーポリシー</h2>
        <p></p>
        <h2>個人情報の利用目的</h2>
        <p>
          当サービスでは利用にあたり名前（アカウント），メールアドレス等の個人情報をご登録いただく場合があります。これらの個人情報は質問に対する回答や必要な情報を連絡する場合に利用するものであり，目的以外では利用しません。
        </p>
        <h2>個人情報の第三者への開示</h2>
        <p>
          当サービスでは、個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
          <ol>
            <li>本人の了解がある場合</li>
            <li>法令等への協力のため、開示が必要となる場合</li>
          </ol>
        </p>
        <h3>個人情報の開示、訂正、追加、削除、利用停止</h3>
        <p>
          本人からの個人データの開示、訂正、追加、削除、利用停止を希望の場合には、本人であることを確認した上で速やかに対応します。
        </p>
        <h3>アクセス解析ツールについて</h3>
        <p>
          当サービスでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
          <br />
          このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ます。この規約に関して、詳細は
          <a
            href="https://marketingplatform.google.com/about/analytics/terms/jp/"
            target="_blank"
          >
            ここ
          </a>
          を確認してください。
        </p>
        <h2>当サービスのコンテンツについて</h2>
        <p>
          当サービスでは各機能を利用の際に使用されたIPアドレスを記録しています。また、コンテンツに掲載された内容によって運営の裁量によって削除する事があります。
        </p>
        <h2>免責事項</h2>
        <p>
          当サービスからリンクやバナーなどによって他のサービスやサイトに移動した場合、移動先で提供される情報、サービス等について一切の責任を負いません。
          <br />
          当サービスに掲載された内容によって生じた損害等の一切の責任を負いかねます。
        </p>
        <h2>本プライバシーポリシーの変更</h2>
        <p>
          本プライバシーポリシーは適宜改定されます。ユーザーの個人情報の処理には，本ポリシーの最新版が適用されます。また，最新のプライバシーポリシーは常に本ページにて開示されます。本ポリシーへの変更が効力を生じた後に当サービスへのアクセスまたはサービスの利用を継続する場合，ユーザーは改定後の本プライバシーポリシーに拘束されることに同意するものとします。
        </p>
      </div>
    </Wrap>
  )
}
export default PrivacyPolicy

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .terms {
    margin: 20px;
    max-width: 90vw;
    padding: 20px;
    background-color: var(--color-surface);
    color: var(--color-on-surface);
  }
`
