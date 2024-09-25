import { FunctionComponent, useEffect } from 'react';
import { usePixelStatus, usePixelValue } from '@systemic-games/pixels-react';
import { Pixel } from '@systemic-games/pixels-web-connect';

export interface PixelRollResultProps {
  pixel: Pixel;
}

/**
 * @summary Renders the Pixel roll result.
 */
const PixelRollResult: FunctionComponent<PixelRollResultProps> = ({ pixel }: PixelRollResultProps) => {
  const status = usePixelStatus(pixel);
  const [rollResult] = usePixelValue(pixel, 'roll');

  useEffect(() => {
    if (rollResult) {
      // This is where we post the roll to roll20 chat
      console.log(`Pixel ${pixel.name} rolled a ${rollResult.face}`);
    }
  }, [rollResult, pixel]);

  return (
    <div>
      <text>
        Pixel {pixel.name} status: {status}
      </text>
      {!!rollResult && <text>Roll result: {rollResult.face}</text>}
    </div>
  );
};

export default PixelRollResult;
