// styles
import { BoxImg, BoxImgs, ImgSingInStyled, StyleSpan } from 'components/StyledComponents';

// images
import singInDate from 'images/singInDate.png';
import singInDiscuss from 'images/singInDiscuss.png';
import singInLearn from 'images/singInLearn.png';

export const ImagesSingInComponents = () => {
  return (
    <BoxImgs>
      <BoxImg>
        <ImgSingInStyled src={singInDiscuss} alt="img discuss" />
        <StyleSpan> Встречайтесь </StyleSpan>
      </BoxImg>
      <BoxImg>
        <ImgSingInStyled src={singInDate} alt="img date" />
        <StyleSpan>Обсуждайте</StyleSpan>
      </BoxImg>
      <BoxImg>
        <ImgSingInStyled src={singInLearn} alt="img learn" />
        <StyleSpan>Учитесь</StyleSpan>
      </BoxImg>
    </BoxImgs>
  );
};
