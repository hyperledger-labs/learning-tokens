# Learning Tokens

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/hyperledger-labs/learning-tokens/blob/main/LICENSE)

Learning Tokens is an open-source mechanism that uses the composable Interwork Alliance Token Taxonomy Framework (IWA TTF) to produce a Learning Token as a positive reinforcer that recognizes, registers, and certifies skills acquisition and competencies while rewarding community engagement in collective learning.

Table of Contents

1.  Foreword
2.  Document Overview
3.  Educational Markets

    3.1. Learning Principles

    3.2. Learning Environments

    3.3. Skill-based Learning

    3.4. Evaluation and Certification

4.  Educational Market Roles

    4.1. Institutions

    4.2. Instructors

    4.3. Courses

        4.3.1. Content

        4.3.2. Assessment

        4.3.3. Scoring Guides

        4.3.4. Certificates

    4.4. Learners

    4.5. Verifiers

    4.6. Standards Body

5.  Tokenizing the Learning Process

    5.1. Granularity

    5.2. Supply of Learning Opportunities

    5.3. Tokenizing Learning Token

        5.3.1. Scoring Guides as oracles

        5.3.2. Attendance Token for Learners

        5.3.3. Score Token for Learners

        5.3.4. Help Token for Learners

        5.3.5. Score Token for Instructors

    5.4. Token Taxonomy Framework

    5.5. Proposed Roles/Steps

    5.6. Lifecycle for Learning Tokens

    5.7. Potential Impacts of Tokenization

6.  Educational Market Projects/Programs
7.  Potential Alignment with Educational Market Governance
8.  Conclusions

| 1. Foreword |
| ----------- |

Learning Tokens represent the value of –and rights over– the transmission of knowledge. In a network society, education is the fundamental asset that develops human capacities to transform people’s minds. Diverse learning environments foster self-regulated activities that construct wisdom collaboratively. However, our expanding universe of knowledge, skills, attitudes, and values demands constant understanding to better human lives and labor markers. The Skills-first initiative provides one common foundation for that purpose, while our tokenization of learning contributes a much-needed *currency of expertise*.

This report presents the result of the Learning Tokens project of the Hyperledger Mentorship Program 2023 at The Linux Foundation. It expands on the 2022 mentorship and continues the work at the Hyperledger Lab with the same name.

Adopting the Token Taxonomy Framework (TTF) of the InterWork Alliance (IWA) initiative of Global Blockchain Business Council (GBBC), a meta-model for digital assets was designed to standardize the characteristics of the Learning Tokens templates. Eventually, this token model can be promoted for use across the educational institutes registered in GBBC's Global Standards Mapping Initiative (GSMI).

| 2. Document Overview |
| -------------------- |

The document begins with an overall view of educational markets, and their learning principles and environments, in the context of the skill-based learning initiative. A following discussion on the relevance of evaluation and certification considers elements such as the market roles of institutions, instructors, courses (including content, assessments, scoring guides, and certificates), learners, verifiers, and standard bodies.

The document also explains how tokenizing the learning process adds relevance to the concept of granularity. It describes tokens as a currency of expertise, presents scoring guides as oracles that coordinate the flow of creating and transferring token ownership across different stakeholders, explores the lifecycle and impact of tokens, and concludes with the potential alignment with educational market governance.

| 3. Educational Market Background |
| -------------------------------- |

Education is a fundamental asset for our network society, increasingly shifting toward a new form of social organization structured by global networks powered by digital information and communication technologies<sup>1</sup>.

Although the core activities of the network society shape and control human life, most people, for the time being, are not included because the logic of networks incorporates only relevant additions, excluding those with little or no value for the network society itself.

However, education matters because this logic of inclusion and exclusion changes over time in response to different rationales of value-making, and the most important today is the transformation of people’s minds.

Beyond immediate narratives, the network society values developing the human capacity to combine information and communication technology with the organizational transformation of social structures that raise creativity and productivity, stimulate innovation and entrepreneurship with social inclusion, and promote collaboration for technological breakthroughs.

| 3.1. Learning Principles |
| ------------------------ |

Today, the dominant learning theory is socio-constructivist<sup>2</sup>, shaped by the context in which it is situated and actively constructed through social negotiation with others. On this understanding, learning environments should be constructive, fostering self-regulated activities, sensitive to context, and often collaborative.

The principal goal is to acquire adaptive expertise throughout a lifelong journey, “The ability to apply meaningfully-learned knowledge and skills flexibly and creatively in different situations<sup>3</sup>.”

Seven principles guide the development of learning environments: to recognize its social nature; put learners at the center; accept how integral emotions are; be aware that individuals are different, and education should be inclusive; value the importance of assessments; promote building horizontal connections across fields of knowledge, communities, and the wider world<sup>4</sup>.

In such environments, learners can engage actively, understand their individual and cooperative roles, accept their different emotions and motivations, confront challenges that demand hard work, and face clear assessment strategies that support learning with formative feedback within a common framework that connects knowledge, colleagues, and instructors.

| 3.2. Learning Environments |
| -------------------------- |

Educational experiences happen in different contexts, such as structured learning, vocational or training programs, and self-learning environments.

<p align="center">
<img src="https://imgur.com/usN8Kos.jpg"/>
</p>
<p align="center">
Fig. 1. Contexts for learning
</p>

Structural education encompasses experiences planned and conducted by teachers or instructors in institutional settings, with controlled or open access, presential, online, or mobile, where a curriculum or learning framework sets a course of study to earn a degree.

Vocational Education and Training programs are school-based or work-based employment capacity-building methods that promote a learning culture in the workplace. They can be public or private, with controlled access, presential, online or mobile learning, with the specific interest to develop the right skills for the labor market.

Self-learning refers to education one initiates to improve knowledge or skill set away from formal education. It is individually motivated, presential, or online, not necessarily structured, and mainly conducted through the Internet.

| 3.3. Skill-based Education |
| -------------------------- |

Each of these contexts empowers learners of all ages with abilities, skills, attitudes, and values to develop their unique human qualities and set them for a lifetime of learning<sup>5</sup>.

At a moment when labor shortages and the inability to attract talent prevent the transformation of industry, skills become a much-needed currency of expertise, and a skill-first initiative has the potential to transform human lives and labor markets.

We need a taxonomy of skills or common foundation to define and understand these abilities, attitudes, and values required across diverse learning opportunities<sup>6</sup> <sup>7</sup>.

<p align="center">
<img src="https://imgur.com/fkqUEtR.jpg"/>
</p>
<p align="center">
Fig. 2. Coursera Skills Graph
</p>

Such a framework can help us build multiple roadmaps that connect personal lifelong journeys, guide educators and education policymakers, respond to labor markets, facilitate prioritizing private investment in skills development, allow the exchange of best practices, and incorporate work-relevant skills of the future into current childhood education<sup>8</sup>.

| 3.4. Evaluation and Certification |
| --------------------------------- |

Evaluation and certification are fundamental for a lifetime of learning experiences. Assessments evaluate the transmission and acquisition of knowledge. Achievements become powerful emotional motivators. Recognitions validate achievements for anyone in need of a trustful certification of proficiency.

Online certificates, once questionable, evolved into valid alternatives as the importance of online learning grew over the past 40 years<sup>9</sup>.

Lifelong digital badges appeared first as Mozilla Open Badges<sup>10</sup>, 1EdTech, and Open Badges Standard<sup>11</sup>. Afterwards, projects as Blockcerts<sup>12</sup> at MIT, The Open Standard for Blockchain Credentials<sup>13</sup>, and Sony Global Education<sup>14</sup>, among others, promoted blockchain-based digital and verifiable credentials across all levels of academia and corporate learning.

These initiatives can benefit from recognizing the granularity of assessments, supporting the management of certificate registries, and promoting the governance of education.

<p align="center">
<img src="https://imgur.com/UMNLHXt.jpg"/>
</p>
<p align="center">
Fig. 3. Two ways to certificate acquisition of skills: overall or granular
</p>

There has always been granularity of data in the planning, conducting, and evaluating of education. Digital platforms help with automatic grading and electronic submission of grades.

Recognition of acquisition of skills, however, happens at the end of a course or program. Summative evaluation of a collection of experiences misses the advantage of step-by-step planning for learning processes and the platform aggregation of detailed responses at multiple evaluation points.

Without a simple digital measurement of granular advancements there is no way to recognize the partial efforts for completion of courses, neither an option to thread skill-based pathways of units of competence across different curricula, nor possibilities to apply big data science for comprehensive evaluations of teaching strategies.

Digital credentials, on the other hand, don't allow learners to manage the flow of certificates into ordered curriculums, permit educational institutions to establish their mutual recognition of certificates, nor support regulatory bodies to compare learning alternatives.

| 4. Educational Market Roles |
| --------------------------- |

Communication theory provides a framework for understanding education components, relationships, and commitments.

A simple model of education, as transmission of signals, might consider a sender encoding a message at a source, using a channel to send it to a destination, where a receiver decodes the message and feedback confirms the efficacy of their actions.

A more complex representation weighs in the content of the message, its relevance resting in the formative competence of its subject matter, with quality assurance, evaluation, and verification certifying proficiency.

The principal roles of the educational market are institutions, instructors, courses, learners, verifiers, and standard organizations.

<p align="center">
<img src="https://imgur.com/l5zNZya.jpg"/>
</p>
<p align="center">
Fig. 4. Interactions of educational market roles
</p>

| 4.1 Institutions |
| ---------------- |

Institutions are learning environments in physical settings, online places, or with mobile resources that provide structured education, training programs, or self-learning opportunities. They are the source of trust for the credentials they issue.

| 4.2 Instructors |
| --------------- |

Instructors create and teach courses for learners. They develop instructional plans, deliver lessons, assemble, and distribute educational content, and conduct specific evaluation strategies. They are the source of trust for the expertise they transmit.

| 4.3. Courses |
| ------------ |

Courses convey knowledge, skills, attitudes, and values at different places, from academic classes to in-work training, professional or trade conferences, seminars, workshops, webinars, and online tutorials. Their learning materials range from all kinds of available media. They are the source of trust for the learning experience they provide.

| 4.3.1. Content |
| -------------- |

Key topics are structured as transmittable units that respond to learning objectives and pedagogical strategy. Their format and layout presentation techniques are frequently ordered in sections, lectures, or units, at the end of which assessments verify the quality of the learning experience.

| 4.3.2. Assessment |
| ----------------- |

The evaluation confirms the quality of instruction. It judges the acquisition of knowledge and skills by learners. It helps instructors improve their teaching practices. There are four traditional measurements: assistance to lessons, the score of responses to tests and tasks, engagement in class, and feedback scores to instructors.

| 4.3.3. Scoring Guides |
| --------------------- |

Scoring guides give points to the performance of each learner. Upfront, at the beginning of a course, they post the total amount of partial credits available for each lesson, task, test, and even particular questions. Their distribution of values reflects the relative importance of each unit of knowledge with a transparent grading policy to measure individual assistance, scores, and class participation. As the course progresses, these evaluation records give feedback to both instructors and learners.

| 4.3.4. Certificates |
| ------------------- |

Educational credentials certify competence in a specific skill. They attest to the satisfactory completion of an educational program. Their official documents verify the awarding institution and the claim of proficiency in a field of knowledge.

| 4.4. Learners |
| ------------- |

Learning is the ultimate skill for lifelong success. Learners are passionate about new things and concepts. They want to understand, acquire, and apply knowledge. Their way to claim and prove their competence is by holding credentials.

| 4.5. Verifiers |
| -------------- |

To navigate a market of skill-first credentials, stakeholders need a simple validation process to match competencies for task descriptions employers need, abilities profiles for entrepreneurial partnerships, and investment opportunities for financial intermediaries.

| 4.6. Standards |
| -------------- |

Standard organizations oversee quality assurance, accountability, and
qualification frameworks for academic standards<sup>15</sup> <sup>16</sup>. They develop and coordinate standards that support uniformity across learning institutions. In the recent past, as reviewed by UNESCO<sup>17</sup>, they “vary enormously in focus, reach, objectives, and impact.” However, taxonomies of fields of knowledge and skillsets, especially the new skills-first initiative, make new synergies possible with homogeneous databases for policymaking.

| 5. Tokenizing the Learning Process |
| ---------------------------------- |

Skills are taught and learned through the transmission of knowledge. Learning is a lifelong journey where skills are your wealth. Learning Tokens represent the value of that wealth.

| 5.1. Granularity |
| ---------------- |

Eleven millennia ago, at their appearance, tokens referred to the measurement of goods. In the Neolithic, the appearance of this new counting technology, later morphed into writing, coincided with the cultivation of cereals, the management of communal storage for grains, and the commercial needs of the Agricultural Revolution<sup>18</sup>.

<p align="center">
<img src="https://imgur.com/igqz6eX.jpg"/>
</p>
<p align="center">
Fig. 5. Tokens from Tepe Gawra, present day Iraq, ca. 4000 BC. Courtesy the University Museum, the University of Pennsylvania, Philadelphia. Photo by Denisse Schmandt-Besserat.
</p>

Nowadays, as bits replace clay, digital tokens are unique representations of a value recorded in a distributed ledger or blockchain<sup>19</sup>. Cryptography supports their ownership and transfer. Consensus builds the collective registry of transactions for a network of stakeholders. They cannot be forged, are traceable, and can become negotiable instruments when they incorporate rights over financial or non-financial, material, or immaterial assets.

Learning Tokens represent the value of –and rights over– the transmission of knowledge.

At a granular level of detail, Learning Tokens recognize units of competency and five sequential actions to transmit them. An instructor conveys a unit of competency. A learner acquires it. The instructor assesses such acquisition. The learner responds correctly to this evaluation. The instructor awards the learner formal recognition of competence.

<p align="center">
<img src="https://imgur.com/ZQi3tzq.jpg"/>
</p>
<p align="center">
Fig. 6. Transmission of knowledge, skills, attitudes, and values
</p>

Units of competency<sup>20</sup> are consensually agreed statements of knowledge, skills, attitudes, and values required for effective performance in a particular function. Instructors define units of competence in a course or a training program that transmits and certifies them. Lessons might convey multiple units of competency, and diverse assessments might confirm the efficacy of an educational strategy.

Their granularity allows for measuring assessments in detail, describing the logic of their aggregations throughout curricula, interweaving individual learning paths, and assembling skill profiles for life.

The original function of tokens, measuring grains as goods in communal storage, becomes a relevant metaphor for harvesting educational results and gathering digital credentials in personal electronic wallets for the Digital Revolution.

| 5.2. Supply of Learning Opportunities |
| ------------------------------------- |

Learning opportunities grow every day. Universities go beyond formal education and are open to lifelong learners. Vocational training supports trades and apprenticeships. The industry trains employees for better jobs. Online teaching platforms offer courses, and the Internet hosts videos and tutorials for self-learning.

Capacity development strengthens individuals, organizations, and society. Tokenization can help by focusing on results and long-term impacts, being transparent and open, and supporting ownership and leadership of those who benefit from it<sup>21</sup>.

Blockchain-based Learning Tokens differ from other applications that propose distributed ledger technology to transform e-learning platforms<sup>22</sup> <sup>23</sup>.

Its goal is simple and modest: to provide a granular measuring tool for any educational program without interfering with their academic freedom or operating ways.

For institutions –and instructors– such instrument can complement their definition of strategic goals and the evaluation of their methods, enhancing their assessment and grading policies with standardized detailed indicators, and most importantly, without interfering with their market ecosystems.

Learners can own and control the privacy of their development data with a skills wallet or digital curriculum management tool to organize, keep track, and publicize verifiable credentials for their educational achievements<sup>24</sup>.

| 5.3 Tokenizing Learning Tokens |
| ------------------------------ |

Four measurements assess learning: assistance to lessons, the score of responses to tests and tasks, engagement in class, and the feedback learners give for instructors' performance.

Four Tokens can attest to such assessments and become our currency of expertise.

    1. Attendance Token for Learners
    2. Score Token for Learners
    3. Help Token for Learners.
    4. Score Token for Instructors

Scoring guides are the oracles to minting –creating– and transferring these tokens.

| 5.3.1. Scoring Guides as Oracles |
| -------------------------------- |

Scoring guides are the oracle –in tokenization terms– instructors use to assign tokens to learners. At the beginning of a course, they set a transparent grading policy with the maximum number of points available for each assessment. As the course advances, instructors transfer tokens according to the quality of the learner responses to the evaluation.

Scoring tables are the equivalent of nutrition tables that make possible informed food choices for a healthy diet. In this case, they detail the knowledge, skills, attitudes, and values available in each course to nourish a well-prepared mind. As learners learn, acquired units of competency become instructional facts consumed.

| 5.3.2. Attendance Token for Learners |
| ------------------------------------ |

The attendance token represents the value of being present to acquire a unit of competency.

Presence in the learning environment is an indicator of interest. Frequency of attendance measures elemental learner engagement. Some events, conferences, or congresses only require attendance, while others, like digital tutorials or webinars on the Internet, register access and duration of appearance. More advanced educational settings demand further proof of engagement.

A Non-Fungible Token is a digital certificate of a unique asset, in this case, the attendance to a learning opportunity. For a specific event, an instructor gives access to a learner, and when its presence is confirmed, the instructor creates -mints- a dated token that sends -transfers- to the learner.

They are not digital mementos of assistance to an event, like POAPs<sup>25</sup>, but an initial and essential link in a chain that proves the learner's engagement in acquiring a specific field of knowledge and skill.

Metadata that records the field of knowledge and the skill taught at the course the instructor teaches on behalf of a registered institution connects all Learning Tokens.

Fields of knowledge are standard CIP Codes from the Classification of Instructional Programs created by the National Center for Educational Statistics of the Institute of Education Sciences in the U.S. Department of Education<sup>26</sup>.

Skills come from the World Economic Forum Reskilling Revolution Interactive Tools Global Skills Taxonomy and Education 4.0<sup>27</sup>.

A Learning Token Register assigns the IDs for Institutions, Instructors, and Courses, becoming the source of trust for each digital asset.

<p align="center">
<img src="https://imgur.com/0W4035P.jpg"/>
</p>
<p align="center">
Fig. 7. Attendance Token
</p>

| 5.3.3. Score Token for Learners |
| ------------------------------- |

The score token for learners represents the value of acquiring a unit of competency.

An instructor conveys knowledge, skills, attitudes, and values. A learner acquires them. The instructor assesses such acquisition. The learner responds correctly to this evaluation. The instructor awards a score token for learners according to a scoring guide.

Scoring guides are the oracle to assign tokens to learners.

Instructors organize their teaching strategy and evaluation policy as they see fit. They set the granularity of lectures and assessments. The scoring guide presents the maximum number of points available for each step in the process. Learners advance in the course, and the number of tokens earned reflects their progress.

Score tokens for learners are Non-Fungible Tokens. Their metadata records the field of knowledge, the skill taught, and the IDs for the registered course, instructor, and institution.

<p align="center">
<img src="https://imgur.com/2fnfhHS.jpg"/>
</p>
<p align="center">
Fig. 8. Score Token for Learners
</p>

| 5.3.4. Help Token for Learners |
| ------------------------------ |

Help tokens for learners represent the value of engagement in collaborative support.

Context shapes the learning environment actively constructed through social interaction. Instructors define the activities that promote collective engagement. Learners aid instructors by commenting in course forums, assisting colleagues in their homework, or collectively reviewing and grading assessments. Their help puts them at the center of the social nature of education, fuels the powerful emotion of belonging to a group, and builds horizontal connections across fields of knowledge and skill communities around the globe.

The psychology of helping can be contagious. Participation and cooperation can happen within one or several cohorts in a course, through cohorts of different classes, or across diverse learning environments. Helpers have multiple opportunities to build communities of learning.

For this reason, the help token is fungible, that is, digital assets to trade and exchange for one another, creating markets of support and collaboration. To recognize acts of help and to interchange them for other goods, from waivers of certification fees to scholarships or special recognition of proactiveness.

Like the previous tokens, its metadata records the field of knowledge, the skill taught, and the IDs for the registered course, instructor, and institution.

<p align="center">
<img src="https://imgur.com/PuH5Kx9.jpg"/>
</p>
<p align="center">
Fig. 9. Help Token for Learners
</p>

| 5.3.5. Score Token for Instructors |
| ---------------------------------- |

Score tokens for instructors represent the value of their teaching performance.

With the scoring guide, instructors can ask learners to assess their performance at specific moments in a course and receive feedback to improve their teaching strategies.

The token metadata refers again to the field of knowledge, the skill taught, and the IDs for the registered course, instructor, and institution.

<p align="center">
<img src="https://imgur.com/nVFoBof.jpg"/>
</p>
<p align="center">
Fig. 10. Score Token for Instructors
</p>

Learning Tokens, our currency of expertise, represent the value of –and rights over– the transmission of knowledge, skills, attitudes, and values. They recognize the importance of attendance, the engagement of learning, the collaborative support of help, and the feedback for the instructor's performance.

| 5.4 Token Taxonomy Framework |
| ---------------------------- |

The Token Taxonomy Framework<sup>28</sup> (TTF) of the InterWork Alliance, an initiative of the Global Blockchain Business Council, is a meta-model for digital assets. Its goals are to establish a common ground on tokenization with a common language framework that shares base components and controls for the industry stakeholders to work together in the tokenization space.

A common language of templates, classes, and instances, orders tokens. Formulas set reusable taxonomy components to describe their type, behavior, and property sets. Definitions fill the details to deploy token classes with one or more instances of these digital assets.

Existing templates are open source to use. New requirements justify the creation of new templates.

<p align="center">
<img src="https://imgur.com/zGz4PtP.jpg"/>
</p>
<p align="center">
Fig. 11. Learning Tokens in Token Taxonomy Framework
</p>

Learning Tokens proposes two new templates according to TTF. The first is a non-fungible formula with two definitions: attendance –one class only– and scores – for learners and instructors. The second template is a fungible formula for collective support -one class for help. All have multiple instances. The following table describes the characteristics of their base types, behaviors, and property sets, followed by their corresponding formulas.

<p align="center">
<img src="https://imgur.com/wo25jZ7.jpg"/>
</p>
<p align="center">
Table 1. Learning Tokens Formulas, details of base types, behaviours and property sets.
</p>

**Token Taxonomy Framework Formula Format**

<p align="center">
<img src="https://imgur.com/wFPMTLG.jpg"/>
</p>
<p align="center">
</p>

**Formula 1 for Attendance Token, Score Token for Learners, and Score Token for Instructors**

<p align="center">
<img src="https://imgur.com/FAP9kh2.jpg"/>
</p>
<p align="center">
</p>

**Formula 2 for Help Token for Learners**

<p align="center">
<img src="https://imgur.com/eEgyI21.jpg"/>
</p>
<p align="center">
</p>

Their definitions and specifications are in the GitHub repository (URL) here: https://github.com/InterWorkAlliance/TokenTaxonomyFramework

| 5.5. Proposed Roles/Steps |
| ------------------------- |

This figure shows the steps for interacting with Learning Tokens.

<p align="center">
<img src="https://imgur.com/wdZgU3c.jpg"/>
</p>
<p align="center">
Fig.12. Interactions of educational market roles with Learning Tokens
</p>

<p align="center">

An Institution registers in Learning Tokens.

A registered Institution registers an Instructor in Learning Tokens.

A registered Instructor registers a Course in Learning Tokens with its field(s) of knowledge and skill(s).

An Institution accepts Learners to take Courses, presential or online, with or without payment.

Learners register for a Course and share their Skill-Wallet to accumulate Learning Tokens into their Skill Profiles.

Instructors create content and assessments for each course on their preferred platforms.

Courses structure their transmission of knowledge and skills through sequences of sections, units, lessons, or chapters.

There is an evaluation at the end of each section or lesson to assess the degree of assimilation by Learners. Instructors evaluate manually or automatically as they prefer and their platforms allow.

There are many types and numbers of assessments, each with different weights of the total grade.

Course assessments use Rubrics and Scoring Guides for transparent evaluation and grading policies.

Grading systems are different around the world. We suggest using percentages from 0 to 100 for the overall grading range.

To register Fields of Knowledge, we suggest CIP Codes, The Classification of Instructional Programs, by NCES, National Center for Educational Statistics of IES, Institute of Education Sciences, in the U.S. Department of Education. https://nces.ed.gov/ipeds/cipcode/default.aspx?y=55

To register Skills, we suggest the World Economic Forum Reskilling Revolution Interactive Tools Global Skills Taxonomy and Education 4.0 https://www1.reskillingrevolution2030.org/skills-taxonomy/index.html

Instructors tokenize their Scoring Guides by assigning several tokens equivalent to the percentage weight of the total grade for each assessment.

Instructors register Tokenized Scoring Guides in Learning Tokens as a Source of Truth and oracle for minting and transferring tokens to Learners.

As the Course progresses, at the end of each Lesson, Learners are evaluated, individual Grades are assigned accordingly, and registered Learner's Scoring Guides serve as oracles that trigger Smart Contracts to mint and transfer Learning Tokens to each registered Learner's Skill Wallets

As an example of a Scoring Guide for Course X. There are three assessments. The grading policy sets 100 points for learners, 40 for each of the two lessons, and 20 for the final evaluation. Partial weights define the importance of attendance, assessments, and engagement. Learners have 10 points to give feedback to instructors.

</p>

<p align="center">
<img src="https://imgur.com/V7lmxf1.jpg"/>
</p>
<p align="center">
Table 2. Scoring Guide for Course X.
</p>

At the end of Lesson 1, a learner gets only 4 out of 5 points for attendance, 20 instead of 25 available for assessments, and 5 out of 10 for engagement. This personal scoring guide records such achievements and becomes the oracle that triggers minting the equivalent Learning Tokens and transferring them to the learner Skill Wallet.

The learner gives 5 points out of 5 as feedback to the instructor, and the oracle mints and transfers them to the instructor's wallet.

Their respective wallets show the balance of Learning Tokens at the end of that lesson.

<p align="center">
<img src="https://imgur.com/DGEV2F2.jpg"/>
</p>
<p align="center">
Table 3. Lesson 1, personal scoring guide, oracle, and Skill Wallet balance.
</p>

At the end of Lesson 2, our learner gets only 3 out of 5 points for attendance, 15 instead of 25 available for assessments, and 8 out of 10 for engagement. The personal scoring guide records such achievements and becomes the oracle that triggers minting the equivalent Learning Tokens and transferring them to the learner Skill Wallet.

The learner gives 5 points out of 5 as feedback to the instructor, and the oracle mints and transfers them to the instructor's wallet.

Their respective wallets show the balance of Learning Tokens at the end of that lesson.

<p align="center">
<img src="https://imgur.com/ah2XEc4.jpg"/>
</p>
<p align="center">
Table 4. Lesson 2, personal scoring guide, oracle, and Skill Wallet balance.
</p>

At the final evaluation, our learner gets 5 out of 5 attendance points and 10 out of 10 assessment points. The personal scoring guide recording such achievements becomes the oracle that triggers minting the equivalent Learning Tokens and transferring them to the learner Skill Wallet.

Their respective wallets show the balance of Learning Tokens at the end of the final evaluation.

<p align="center">
<img src="https://imgur.com/0BAZqkl.jpg"/>
</p>
<p align="center">
Table 5. Final evaluation, personal scoring guide, oracle, and Skill Wallet balance.
</p>
<p align="center">
    
Two scoring guides shows the learner granular assessment against the grading policy for the course.

</p>
<p align="center">
<img src="https://imgur.com/YVUKSfg.jpg"/>
</p>
<p align="center">
Table 6. Granular assessment of one learner vs the course grading policy.
</p>

| 5.6 Lifecycle for Learning Tokens |
| --------------------------------- |

There are four stages in the life cycle of Learning Tokens: granting, proving, exchanging, and verifying their issuance (blue).

These stages occur within a trust governance that manages a framework (orange) and a registry (green).

<p align="center">
<img src="https://imgur.com/1Jw39IK.jpg"/>
</p>
<p align="center">
Fig.13. Life Cycle for Learning Tokens, after Darren O’Donnell’s Governance -> Trust Registry
</p>
Instructors grant Learning Tokens to learners by minting from a scoring guide oracle and transferring them from the instructor’s wallet to a learner skill wallet.

Learners hold Learning Tokens in skill wallets as personal profiles of knowledge, skills, attitudes, and values. They keep complete control and ownership of data.

As credentials, Learning Tokens prove the competency employers require for a job, partners for an enterprise, investors for confidence, or clients for a service.

As assets, Learning Tokens have value to exchange in a market for collaborative learning support.

Stakeholders and the marketplace confirm the issuer in a Trust Registry of institutions, instructors, courses, and scoring guides.

Educational authorities and standard bodies regulate the process with an evolving institutional governance framework that is part of our next phase.

| 5.6 Potential Impacts of Tokenization |
| ------------------------------------- |

The exchange of units of competency is the fundamental particle of education. Tokenization represents its value as a digital asset.

This granular vision allows us to process and understand vast amounts of educational data with a common framework of building blocks.

As in other fields of the economy, Learning Tokens can prove ownership of competency, facilitating the transparency of its acquisition and a quicker confirmation of issuance.

Analysis of massive homogeneous skill-based data supports strategic decisions to unlock new educational opportunities, increase market liquidity for talent, and better regulation environments.

Pedagogically, increasing efficiency for automation improves how learners engage actively in individual and cooperative roles, facing clear assessment strategies with formative feedback, makes possible multiple roadmaps for personal lifelong journeys, guides educators and education policymakers, responds to labor markets, facilitates prioritizing private investment in skills development, and allows the exchange of best practices.

| 6. Educational Market Projects/Programs |
| --------------------------------------- |

Learning Tokens register the value of transmission of knowledge for any educational project or program, independently of their pedagogical strategies, academic autonomy, learning management systems, or institutional records.

It adds to all without interfering with their different units of competency, content, assessments, or relative weight on grades.

Three aspects, however, guarantee the homogeneity of the tokenization. A set of taxonomies to categorize fields of knowledge and description of skills, the scoring guide as the oracle for token management, and the trusted registry as the ultimate source to confirm their issuance.

It becomes relevant to understand how taxonomies, scoring guides, and the registry of trust accommodate the different market needs of structured learning,vocational education, training programs, professional development, online and self-learning on the Internet.

| 7. Potential Alignment with Educational Market Governance, Terminology, and Emerging Principles |
| ----------------------------------------------------------------------------------------------- |

To align with educational markets, we need a governance framework for coordinating participants to reach a consensus on token definition, to assemble taxonomies of knowledge, skills, attitudes, and values, to maintain a Registry of Trust, and to expand the use of Learning Tokens.

Standards for granular evaluation of education can be a thematic workgroup task force of the Token Taxonomy Framework at InterWork Alliance and Global Blockchain Business Council.

Open-source communities at Hyperledger Foundation can develop digital connections for learning management systems.

Expanding the benefits of Skill Wallets and Learning Tokens can begin with courses at the Linux Foundation and the blockchain-teaching institutions registered in the Global Standard Mapping Initiative of the Global Blockchain Business Council.

| 8. Conclusions |
| ----------------------- |

Learning Tokens provide the ability to measure knowledge, skills, attitudes, and values in a granular standardized way, independent from pedagogical strategies, academic autonomy, learning management systems, or institutional records,

Learning Tokens facilitate a repository of knowledge for understanding what education is.

Learning Tokens give learners ownership and control of their data to prove the competency employers need for a job, partners demand to enterprise, investors require confidence, and clients ask for a better service.

Learning Tokens support all stakeholders to create markets for collaborative learning support.

| 9. GitHub Link to the implementation of Learning Tokens |
| ------------------------------------------------------- |

You can find the source code along with the instruction to run it locally from here [https://github.com/hyperledger-labs/learning-tokens ](https://github.com/TanjinAlam/learning-tokens/tree/tanjin/src).


| Authors |
| ----------------------- |

Alfonso Govela, Linux Foundation Mentor, Hyperledger Mentorship Program 2023

Tanjin Alam, Linux Foundation Mentee, Hyperledger Mentorship Program 2023

Diana Barrero Zalles, Head of Research and Sustainability, Global Blockchain Business Council

Jackson Ross, Technical Program Lead, Global Blockchain Business Council



| ENDNOTES |
| -------- |

<sup>1</sup>Castells, M., Editor (2004), The Network Society, A Cross-Cultural Perspective. Edward Elgar Publishing, Inc., Cheltenham, UK, Northampton, MA, USA <br />

<sup>2</sup>Dumont, H., Istance, D., Benavides, F. OECD (2010), The Nature of Learning, Using Research to Inspire Practice. OECD, Publishing, Paris. Retrieved from https://doi.org/10.1787/9789264086487-en\ <br />

<sup>3</sup>Catherine McAuley College. Learning: What is understood today. Retrieved from https://www.cmc.vic.edu.au/wp-content/uploads/2018/04/CMC-2019-Learning-and-Teaching-rationale-and-focus.pdf <br />

<sup>4</sup>OECD (2017), The OECD Handbook for Innovative Learning Environments, OECD, Publishing, Paris, Retrieved from <br />

<sup>5</sup>World Economic Forum (2023), Putting Skills First: A Framework for Action, World Economic Forum in collaboration with PwC. Retrieved from https://www.weforum.org/publications/putting-skills-first-a-framework-for-action <br />

<sup>6</sup>World Economic Forum (2023), Defining Education 4.0: A Taxonomy for the Future of Learning. Retrieved from https://www3.weforum.org/docs/WEF_Defining_Education_4.0_2023.pdf <br />

<sup>7</sup>Glassberg Sands, E. 2018. How our Skills Graph is helping learners find the right content to reach their goals. Medium. Retrieved from https://medium.com/coursera-engineering/courseras-skills-graph-helps-learners-find-the-right-content-to-reach-their-goals-b10418a05214 <br />

<sup>8</sup>World Economic Forum (2023), op.cit.<br />

<sup>9</sup>MIT Digital Credentials Consortium, https://digitalcredentials.mit.edu/ <br />

<sup>10</sup> Surman, M. (2011). Mozilla Launches Open Badges Project. Mozilla Blog dist://ed, September 15, 2011. Retrieved from https://blog.mozilla.org/en/mozilla/openbadges/ <br />

<sup>11</sup>Open Badges, https://openbadges.org/ <br />

<sup>12</sup>Schmidt, P. (2016), Blockcerts – An Open Infrastructure for Academic Credentials on the Blockchain. MIT Media Lab Learning Initiative. Retrieved from Medium https://medium.com/mit-media-lab/blockcerts-an-open-infrastructure-for-academic-credentials-on-the-blockchain-899a6b880b2f <br />

<sup>13</sup>Blockcerts, The Open Standard for Blockchain Credentials. Retrieved from https://www.blockcerts.org/ <br />

<sup>14</sup>Sony Global Education (2016). Sony Global Education Develops Technology Using Blockchain for Open Sharing of Academic Proficiency and Progress Records. Retrieved from https://www.sony.com/en/SonyInfo/News/Press/201602/16-0222E/ <br />

<sup>15</sup>EdMatrix, Directory of Learning Data and Content Standards, retrieved from https://www.edmatrix.org/organizations.html <br />

<sup>16</sup> Wikiversity, Educational Standards Organizations, retrieved from https://en.wikiversity.org/wiki/Educational_standards_organisations <br />

<sup>17</sup> Altbach, P. G., Reisberg, L., and. Rumbley, L.E. (2009). "Trends in Global Higher Education: Tracking an Academic Revolution. A Report Prepared for the UNESCO 2009 World Conference on Higher Education" (France, UNESCO, 2009) retrieved from https://unesdoc.unesco.org/ark:/48223/pf0000183219 <br />

<sup>18</sup> Schmandt-Besserat, D. (2019). The Invention of Tokens. Included in Crisá, A., Gkikaki, M., and Rowan, C., Eds., TOKENS, Culture, Connections, Communities. Royal Numismatic Society, Special Publication No. 57. London <br />

<sup>19</sup>Garrido, J.M. (2023). Digital Tokens: a Legal Perspective”. IMF Working Papers. Working Paper No. 2023/151. International Monetary Fund.
<br />

<sup>20</sup>UNESCO-UNEVOC TVETipedia Glossary, NCVER (Australia), VOCEDPlus: Glossary of VET. Source: retrieved from https://glossary-vet.voced.edu.au/default.asp?op=DISPTERM&searchString=Units+of+competency&lang=ENG <br />

<sup>21</sup> OECD (2012), Supporting Partners to Develop their Capacity. 12 lessons from DAC Peer Reviews. OECD. Retrieved from https://www.oecd.org/fr/cad/examens-pairs/Capacity12lessons.pdf <br />

<sup>22</sup> Lam, T.Y., Dongol, B. (2020). A blockchain-enabled e-learning platform. Interactive Learning Environments 30(3):1-23, February 2020. Retrieved from
<br />

<sup>23</sup>Lam, T.Y. The ‘Blockchain University’ project. Retrieved from https://github.com/dtylam/bcu
<br />

<sup>24</sup>Domingue, J., Mikroyannidis, A. (2022). Blockchain in Education. OpenLearn. Retrieved from https://www.open.edu/openlearn/digital-computing/blockchain-education <br />

<sup>25</sup> POAP, Proof of Attendance Protocol, Retrieved from https://poap.xyz/ <br />

<sup>26</sup> CIP Codes, The Classification of Instructional Programs, by NCES, National Center for Educational Statistics of IES, Institute of Education Sciences, at the US. Department of Education. https://nces.ed.gov/ipeds/cipcode/default.aspx?y=55 <br />

<sup>27</sup>World Economic Forum, Reskilling Revolution Interactive Tools Global Skills Taxonomy and Education 4.0 https://www1.reskillingrevolution2030.org/skills-taxonomy/index.html <br />

<sup>28</sup> InterWork Alliance Token Taxonomy Framework GitHub Repository. Retrieved from https://github.com/InterWorkAlliance/TokenTaxonomyFramework


## Explore our initial achievements from the year 2022 From [GitHub Repository](https://github.com/hyperledger-labs/learning-tokens).
