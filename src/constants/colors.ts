export const COLOR_PALETTE = [
  { base: 'pink',   bg: '#FDD8EE', border: '#C7117F' },
  { base: 'yellow', bg: '#FFF2C4', border: '#EB9C03' },
  { base: 'blue',   bg: '#DAEFFE', border: '#0C5A93' },
  { base: 'green',  bg: '#D1FEB6', border: '#4B991C' },
  { base: 'orange', bg: '#FFE2BF', border: '#D67F19' },
  { base: 'purple', bg: '#F3D6FD', border: '#681A83' },
  { base: 'red',    bg: '#FDDBDB', border: '#B10C0C'},
  { base: 'teal',   bg: '#D9FFF6', border: '#349A82'},
  { base: 'indigo', bg: '#DCD7FF', border: '#211090'},
  { base: 'deepGray', bg: '#E3E5F8', border: '#2A2D48'},
];

export const getSubjectColor = (subjectCode: string) => {
    let hash = 0;
    for (let i = 0; i < subjectCode.length; i++) {
        hash = subjectCode.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLOR_PALETTE.length;
    return COLOR_PALETTE[index];
}