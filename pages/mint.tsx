import { Default } from 'components/layouts/Default';
import { NextPage } from 'next';
import Mint from 'components/templates/mint/Mint';

const MintPage: NextPage<any> = (props) => {
  return (
    <Default pageName="Transactions">
      <Mint {...props} />
    </Default>
  );
};


export default MintPage;
