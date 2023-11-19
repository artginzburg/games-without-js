import Link from 'next/link';
import { FaChessBoard, FaGithubAlt } from 'react-icons/fa6';

import { texts as memoryGameTexts } from './memoria/data/texts';
import {
  Footer,
  FooterLinks,
  FutureGamesList,
  FutureGamesSection,
  GamesList,
  Heading1,
  Heading2,
  MainContainer,
  PageWrapper,
  SmallSubtitle,
  Subtitle,
} from './page.styled';

export default function Home() {
  return (
    <PageWrapper>
      <MainContainer>
        <section>
          <Heading1>Games without JS</Heading1>
          <Subtitle>
            No client-side JavaScript, relying purely on <span>SSR and CSS</span>. Disable JS in
            your browser for an immersive experience
          </Subtitle>
        </section>
        <article>
          <GamesList>
            <li>
              <Link href={'/memoria'}>
                <FaChessBoard /> {memoryGameTexts.title}{' '}
                <span>· {memoryGameTexts.description}</span>
              </Link>
            </li>
          </GamesList>
          <FutureGamesSection>
            <Heading2>Coming soon...</Heading2>
            <FutureGamesList>
              <li>Maze</li>
              <li>Whack-a-mole</li>
              <li>Sudoku</li>
              <li>2048</li>
            </FutureGamesList>
          </FutureGamesSection>
        </article>
      </MainContainer>
      <Footer>
        <Subtitle>
          Next time a conversation goes <span>{'"Why Next.js?"'}</span> — you know what to do.
        </Subtitle>
        <SmallSubtitle>
          {
            "Please don't ask how much it costs to host. It's an experiment, not a production technique"
          }
        </SmallSubtitle>
        <FooterLinks>
          <Link href="https://github.com/artginzburg/games-without-js">
            <FaGithubAlt /> GitHub
          </Link>
        </FooterLinks>
      </Footer>
    </PageWrapper>
  );
}
