function hasBit(field: bigint, bit: bigint): boolean;
function hasBit(field: number, bit: number): boolean;
function hasBit(field, bit): boolean {
  return (field & bit) === bit;
}

export default hasBit;
