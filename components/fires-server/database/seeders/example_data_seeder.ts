import Label from '#models/label'
import Setting from '#models/setting'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import dedent from 'dedent'

export default class extends BaseSeeder {
  async run() {
    await Setting.updateOrCreateMany('key', [
      {
        key: 'name',
        value: 'Example FIRES Server',
      },
      {
        key: 'summary',
        value:
          'An example FIRES server for labels, moderation advisories, and moderation recommendations.',
      },
    ])

    await Label.updateOrCreateMany('name', [
      {
        name: 'CSAM',
        summary: 'Child Sexual Abuse Material',
        description: dedent`
          Imagery or videos which show a person who is a child and engaged in or is depicted as being engaged in explicit sexual activity.

          Note: It is inappropriate to refer to this material as pornography. Although some laws refer to “child pornography”, pornography implies consent, which a child can never give.

          Also known as: CP, CSEI, CSAI, SG-CSAM, CG-CSAM

          ## Library Resources:
            - [CSAM Primer](https://connect.iftas.org/library/legal-regulatory/csam-primer/)
            - [CSAM Reporting Requirements](https://connect.iftas.org/library/legal-regulatory/csam-reporting-requirements/)
            - [Tech Coalition's Industry Classification System](https://paragonn-cdn.nyc3.cdn.digitaloceanspaces.com/technologycoalition.org/uploads/Tech_Coalition_Industry_Classification_System.pdf)
            - [ECPAT's Terminology Guidelines](https://ecpat.org/wp-content/uploads/2021/05/Terminology-guidelines-396922-EN-1.pdf)

          Source: the [IFTAS Trust & Safety Library](https://connect.iftas.org/library/content/csam/) - supporting volunteer moderators in the Fediverse
        `,
        locale: 'en-US',
      },
      {
        name: 'NCII',
        summary:
          'Non-Consensual Intimate Imagery: Non-consensual image sharing, or non-consensual intimate image sharing (also called “non-consensual explicit imagery” or colloquially called “revenge porn”), refers to the act or threat of creating, publishing or sharing an intimate image or video without the consent of the individuals visible in it.',
        description: dedent`
          Non-consensual intimate imagery, often referred to as “revenge porn,” involves sharing or distributing sexually explicit materials without the consent of the individual featured. This practice infringes on privacy and can lead to significant emotional and social harm for the victims. As technology has become more integral to forming and maintaining relationships, sharing intimate images has become more common. Unfortunately, this can lead to privacy violations if such content is shared without consent, whether it was initially shared willingly or captured without permission. Misuse of intimate images can involve blackmail, manipulation, or threats, causing distress, humiliation, potential outing of sexual orientation, job loss, and financial hardship.

          ## Challenges for Content Moderators

          Quickly identifying and removing NCII to minimise harm, while ensuring that reports are accurate.
          Providing clear channels for victims to report violations and ensuring they receive appropriate support.
          Adhering to various laws and regulations that govern the sharing of such content.

          ## Tools and Resources

          - [CCRI Safety Center](https://cybercivilrights.org/ccri-safety-center/): If you are a victim or survivor of image-based sexual abuse, you may want some help deciding what to do next.
          - [StopNCII.org](https://stopncii.org): StopNCII.org is a free tool designed to support victims of Non-Consensual Intimate Image (NCII) abuse.

          ## Example Rule

          Sharing intimate images without explicit consent from the individuals involved is strictly prohibited. We are committed to protecting our community’s privacy and safety, and any violation of this policy will result in immediate account suspension and potential legal action.

          Source: the [IFTAS Trust & Safety Library](https://connect.iftas.org/library/content/ncii/) - supporting volunteer moderators in the Fediverse
        `,
        locale: 'en-US',
      },
      {
        name: 'Spam',
        summary:
          'Unsolicited, low-quality communications, often (but not necessarily) high-volume commercial solicitations, sent through a range of electronic media, including email, messaging, and social media.',
        description: dedent`
          ## Resources:

          - [Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_classifier)
          - [Spam User Name Text Strings](https://connect.iftas.org/library/iftas-documentation/spam-user-name-text-strings/)

          ## Example Rule

          Posting or distributing unsolicited or repetitive messages, commonly known as spam, is prohibited. This includes advertising content, phishing attempts, and irrelevant postings.

          Source: the [IFTAS Trust & Safety Library](https://connect.iftas.org/library/content/spam/) - supporting volunteer moderators in the Fediverse
        `,
        locale: 'en-US',
      },
    ])
  }
}
