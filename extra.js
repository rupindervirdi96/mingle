let x = [
  { name: "LALLA", id: "1234" },
  { name: "abcd", id: "1235" },
  { name: "LAdefgLLA", id: "1236" },
];

console.log(
  x.map((x) =>
    x.id === "1234" ? (x = { name: "dewbhfbferf", id: "1236" }) : x
  )
);
