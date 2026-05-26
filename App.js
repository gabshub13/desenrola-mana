import React, { createContext, useContext, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const C = {
  ink: "#231F2D",
  muted: "#7A7384",
  bg: "#FAF8FC",
  card: "#FFFFFF",
  line: "#EEE8F3",
  violet: "#7C3AED",
  lilac: "#EDE2FF",
  rose: "#FF6F91",
  peach: "#FFE5D6",
  soft: "#F3EFF8",
  ok: "#2EAD72"
};

const categories = [
  ["Beleza", "sparkles"],
  ["Casa", "home"],
  ["Aulas", "book"],
  ["Bem-estar", "heart"],
  ["Eventos", "camera"],
  ["Consultoria", "briefcase"]
];

const professionals = [
  {
    id: "1",
    name: "Lia Martins",
    category: "Beleza",
    title: "Maquiadora social e noivas",
    rating: 4.97,
    reviews: 126,
    price: 90,
    avatar: "LM",
    bio: "Atendimento acolhedor, pontual e especializado em pele real para eventos, fotos e autocuidado.",
    services: ["Make social - R$ 90", "Penteado simples - R$ 70", "Noiva express - R$ 180"],
    comments: ["Fiquei linda e tranquila.", "Pontual, cuidadosa e muito talentosa."]
  },
  {
    id: "2",
    name: "Rafa Nunes",
    category: "Casa",
    title: "Organização residencial",
    rating: 4.91,
    reviews: 88,
    price: 120,
    avatar: "RN",
    bio: "Organizo armários, cozinhas e rotinas domésticas com método simples para manter tudo leve.",
    services: ["Diária de organização - R$ 120", "Closet - R$ 160", "Cozinha - R$ 140"],
    comments: ["Mudou minha rotina.", "Prática, gentil e muito eficiente."]
  },
  {
    id: "3",
    name: "Bia Costa",
    category: "Aulas",
    title: "Aulas particulares de matemática",
    rating: 4.95,
    reviews: 74,
    price: 85,
    avatar: "BC",
    bio: "Aulas para ensino fundamental e médio com linguagem fácil, exercícios guiados e plano por objetivo.",
    services: ["Aula avulsa - R$ 85", "Pacote 4 aulas - R$ 300", "Revisão prova - R$ 110"],
    comments: ["Minha filha ganhou confiança.", "Explica com paciência."]
  },
  {
    id: "4",
    name: "Nina Prado",
    category: "Bem-estar",
    title: "Massoterapia relaxante",
    rating: 4.89,
    reviews: 63,
    price: 130,
    avatar: "NP",
    bio: "Sessões de relaxamento, drenagem e cuidado corporal com escuta e ambiente seguro.",
    services: ["Relaxante - R$ 130", "Drenagem - R$ 150", "Quick massage - R$ 70"],
    comments: ["Saí renovada.", "Super respeitosa e profissional."]
  }
];

const Flow = createContext(null);
const useFlow = () => useContext(Flow);

function FlowProvider({ children }) {
  const [screen, setScreen] = useState("welcome");
  const [category, setCategory] = useState("Beleza");
  const [pro, setPro] = useState(null);
  const [booking, setBooking] = useState({ paid: false, date: null, token: "" });
  const [rating, setRating] = useState(0);

  const api = useMemo(() => ({
    screen,
    category,
    pro,
    booking,
    rating,
    go: setScreen,
    pickCategory: (next) => {
      setCategory(next);
      setScreen("search");
    },
    pickPro: (next) => {
      setPro(next);
      setScreen("profile");
    },
    pay: (date) => {
      setBooking({ paid: true, date, token: String(Math.floor(100000 + Math.random() * 900000)) });
      setScreen("chat");
    },
    requirePaidChat: () => (booking.paid ? setScreen("chat") : Alert.alert("Chat bloqueado", "Finalize a taxa de reserva para liberar o chat.")),
    validateToken: (typed) => {
      if (typed === booking.token) setScreen("review");
      else Alert.alert("Token incorreto", "Confira o token com a cliente antes de concluir o serviço.");
    },
    setRating
  }), [screen, category, pro, booking, rating]);

  return <Flow.Provider value={api}>{children}</Flow.Provider>;
}

const money = (n) => `R$ ${n.toFixed(0)}`;
const stars = (n) => "★★★★★".slice(0, Math.round(n));

function AppShell() {
  const { screen } = useFlow();
  const screens = {
    welcome: <Welcome />,
    home: <Home />,
    search: <Search />,
    profile: <Profile />,
    booking: <Booking />,
    chat: <Chat />,
    token: <Token />,
    review: <Review />
  };
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      {screens[screen]}
    </SafeAreaView>
  );
}

function Top({ title, back, right }) {
  const { go } = useFlow();
  return (
    <View style={s.top}>
      {back ? <IconButton icon="arrow-back" onPress={() => go(back)} /> : <View style={s.iconGhost} />}
      <Text style={s.topTitle}>{title}</Text>
      {right || <View style={s.iconGhost} />}
    </View>
  );
}

function IconButton({ icon, onPress, tone = "soft" }) {
  return (
    <Pressable onPress={onPress} style={[s.iconBtn, tone === "rose" && { backgroundColor: C.peach }]}>
      <Ionicons name={icon} size={22} color={C.ink} />
    </Pressable>
  );
}

function Primary({ children, onPress, disabled }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[s.primary, disabled && { opacity: 0.45 }]}>
      <Text style={s.primaryText}>{children}</Text>
    </Pressable>
  );
}

function Welcome() {
  const { go } = useFlow();
  return (
    <View style={s.welcome}>
      <View style={s.brandMark}><Text style={s.brandMarkText}>DM</Text></View>
      <Text style={s.hero}>Desenrola Mana</Text>
      <Text style={s.sub}>Serviços feitos por mulheres, para mulheres, com reserva segura e conversa liberada no momento certo.</Text>
      <View style={s.profileChoice}>
        <Text style={s.choiceTitle}>Como você quer começar?</Text>
        <Primary onPress={() => go("home")}>Quero Contratar</Primary>
        <Pressable style={s.secondary} onPress={() => Alert.alert("Em breve", "Cadastro de prestadoras no próximo ciclo do MVP.")}>
          <Text style={s.secondaryText}>Quero Prestar Serviços</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Home() {
  const { pickCategory } = useFlow();
  return (
    <ScrollView style={s.page} showsVerticalScrollIndicator={false}>
      <Text style={s.h1}>Encontre uma mana para resolver</Text>
      <View style={s.search}>
        <Ionicons name="search" size={22} color={C.muted} />
        <TextInput placeholder="Buscar serviço" placeholderTextColor={C.muted} style={s.input} />
      </View>
      <Text style={s.section}>Categorias</Text>
      <View style={s.grid}>
        {categories.map(([name, icon]) => (
          <Pressable key={name} style={s.category} onPress={() => pickCategory(name)}>
            <Ionicons name={icon} size={26} color={C.violet} />
            <Text style={s.categoryText}>{name}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={s.section}>Mais buscados</Text>
      <FlatList
        horizontal
        data={professionals}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <MiniPro item={item} />}
      />
    </ScrollView>
  );
}

function MiniPro({ item }) {
  const { pickPro } = useFlow();
  return (
    <Pressable style={s.mini} onPress={() => pickPro(item)}>
      <Avatar label={item.avatar} />
      <Text style={s.cardTitle}>{item.title}</Text>
      <Text style={s.muted}>{item.category} · ★ {item.rating}</Text>
      <Text style={s.price}>A partir de {money(item.price)}</Text>
    </Pressable>
  );
}

function Search() {
  const { category, pickPro, go } = useFlow();
  const list = professionals.filter((p) => p.category === category);
  return (
    <View style={s.page}>
      <Top title={category} back="home" />
      <View style={s.filterBar}>
        {["Hoje", "Até R$150", "Melhor avaliadas"].map((x) => <Text key={x} style={s.pill}>{x}</Text>)}
      </View>
      <FlatList
        data={list.length ? list : professionals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={s.proRow} onPress={() => pickPro(item)}>
            <Avatar label={item.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{item.name}</Text>
              <Text style={s.muted}>{item.title}</Text>
              <Text style={s.muted}>★ {item.rating} · {item.reviews} avaliações</Text>
            </View>
            <Text style={s.price}>{money(item.price)}</Text>
          </Pressable>
        )}
        ListFooterComponent={<Primary onPress={() => go("home")}>Ver outras categorias</Primary>}
      />
    </View>
  );
}

function Profile() {
  const { pro, go } = useFlow();
  return (
    <View style={s.flex}>
      <ScrollView style={s.page} showsVerticalScrollIndicator={false}>
        <Top title="" back="search" right={<IconButton icon="heart-outline" tone="rose" />} />
        <View style={s.profileHero}>
          <Avatar label={pro.avatar} big />
          <Text style={s.h1}>{pro.name}</Text>
          <Text style={s.centerMuted}>{pro.title}</Text>
          <View style={s.stats}>
            <Stat value={pro.rating} label="nota" />
            <Stat value={stars(pro.rating)} label="favorita" />
            <Stat value={pro.reviews} label="avaliações" />
          </View>
        </View>
        <Text style={s.section}>Sobre</Text>
        <Text style={s.body}>{pro.bio}</Text>
        <Text style={s.section}>Serviços</Text>
        {pro.services.map((item) => <Text key={item} style={s.service}>{item}</Text>)}
        <Text style={s.section}>Avaliações</Text>
        {pro.comments.map((item) => <Text key={item} style={s.comment}>“{item}”</Text>)}
      </ScrollView>
      <View style={s.sticky}>
        <View><Text style={s.price}>{money(pro.price)}</Text><Text style={s.muted}>taxa base</Text></View>
        <Primary onPress={() => go("booking")}>Agendar</Primary>
      </View>
    </View>
  );
}

function Booking() {
  const { pro, pay } = useFlow();
  const [date, setDate] = useState("Qua, 29 mai · 14:00");
  const slots = ["Ter, 28 mai · 10:00", "Qua, 29 mai · 14:00", "Sex, 31 mai · 16:30"];
  return (
    <ScrollView style={s.page}>
      <Top title="Reserva" back="profile" />
      <Text style={s.h1}>Escolha um horário</Text>
      {slots.map((slot) => (
        <Pressable key={slot} onPress={() => setDate(slot)} style={[s.slot, date === slot && s.slotOn]}>
          <Text style={s.slotText}>{slot}</Text>
          {date === slot && <Ionicons name="checkmark-circle" size={22} color={C.violet} />}
        </Pressable>
      ))}
      <View style={s.payBox}>
        <Text style={s.cardTitle}>Taxa de reserva</Text>
        <Text style={s.body}>O chat será liberado após o pagamento simulado.</Text>
        <Text style={s.total}>{money(Math.round(pro.price * 0.2))}</Text>
      </View>
      <Primary onPress={() => pay(date)}>Pagar taxa e liberar chat</Primary>
    </ScrollView>
  );
}

function Chat() {
  const { pro, booking, go, requirePaidChat } = useFlow();
  if (!booking.paid) {
    return <Locked title="Chat bloqueado" action={requirePaidChat} />;
  }
  return (
    <View style={s.flex}>
      <Top title={pro.name} back="profile" right={<IconButton icon="shield-checkmark" onPress={() => go("token")} />} />
      <ScrollView style={s.chat}>
        <Bubble left text={`Oi! Vi sua reserva para ${booking.date}. Pode me contar o endereço e uma referência?`} />
        <Bubble text="Claro! Envio aqui. Obrigada pelo retorno rápido." />
        <Bubble left text="Combinado. No fim do serviço, use o token de segurança para confirmar." />
      </ScrollView>
      <View style={s.composer}>
        <TextInput placeholder="Mensagem" placeholderTextColor={C.muted} style={s.composerInput} />
        <IconButton icon="send" />
      </View>
    </View>
  );
}

function Token() {
  const { booking, validateToken, go } = useFlow();
  const [typed, setTyped] = useState("");
  return (
    <ScrollView style={s.page}>
      <Top title="Segurança" back="chat" />
      <View style={s.tokenCard}>
        <Ionicons name="shield-checkmark" size={44} color={C.violet} />
        <Text style={s.token}>{booking.token}</Text>
        <Text style={s.centerMuted}>Informe este token à prestadora na conclusão do serviço.</Text>
      </View>
      <Text style={s.section}>Finalização do serviço</Text>
      <TextInput value={typed} onChangeText={setTyped} keyboardType="number-pad" maxLength={6} placeholder="Digite o token informado" style={s.textField} />
      <Primary onPress={() => validateToken(typed)}>Validar e avaliar</Primary>
      <Pressable onPress={() => go("chat")}><Text style={s.link}>Voltar ao chat</Text></Pressable>
    </ScrollView>
  );
}

function Review() {
  const { pro, rating, setRating, go } = useFlow();
  return (
    <ScrollView style={s.page}>
      <Top title="Avaliação" back="token" />
      <Text style={s.h1}>Como foi com {pro.name}?</Text>
      <View style={s.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setRating(n)}>
            <Ionicons name={n <= rating ? "star" : "star-outline"} size={42} color={C.rose} />
          </Pressable>
        ))}
      </View>
      <TextInput multiline placeholder="Conte como foi sua experiência" placeholderTextColor={C.muted} style={[s.textField, s.area]} />
      <Primary onPress={() => Alert.alert("Obrigada!", "Avaliação enviada com sucesso.", [{ text: "OK", onPress: () => go("home") }])}>Enviar avaliação</Primary>
    </ScrollView>
  );
}

function Locked({ title, action }) {
  return (
    <View style={s.welcome}>
      <Ionicons name="lock-closed" size={48} color={C.violet} />
      <Text style={s.h1}>{title}</Text>
      <Text style={s.sub}>A conversa só fica disponível depois da taxa de reserva aprovada.</Text>
      <Primary onPress={action}>Ir para pagamento</Primary>
    </View>
  );
}

function Avatar({ label, big }) {
  return <View style={[s.avatar, big && s.avatarBig]}><Text style={[s.avatarText, big && s.avatarBigText]}>{label}</Text></View>;
}

function Stat({ value, label }) {
  return <View style={s.stat}><Text style={s.statValue}>{value}</Text><Text style={s.muted}>{label}</Text></View>;
}

function Bubble({ text, left }) {
  return <Text style={[s.bubble, left ? s.bubbleLeft : s.bubbleRight]}>{text}</Text>;
}

export default function App() {
  return (
    <FlowProvider>
      <AppShell />
    </FlowProvider>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1, backgroundColor: C.bg },
  page: { flex: 1, padding: 22, backgroundColor: C.bg },
  welcome: { flex: 1, justifyContent: "center", padding: 28, backgroundColor: C.bg },
  brandMark: { width: 76, height: 76, borderRadius: 24, backgroundColor: C.violet, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  brandMarkText: { color: "white", fontSize: 24, fontWeight: "900" },
  hero: { color: C.ink, fontSize: 42, fontWeight: "900", letterSpacing: 0 },
  h1: { color: C.ink, fontSize: 32, fontWeight: "900", marginTop: 10, marginBottom: 14, letterSpacing: 0 },
  sub: { color: C.muted, fontSize: 18, lineHeight: 26, marginVertical: 14 },
  profileChoice: { gap: 12, marginTop: 34 },
  choiceTitle: { color: C.ink, fontSize: 20, fontWeight: "800" },
  primary: { minWidth: 150, backgroundColor: C.violet, borderRadius: 28, paddingVertical: 16, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" },
  primaryText: { color: "white", fontSize: 17, fontWeight: "900" },
  secondary: { backgroundColor: C.lilac, borderRadius: 28, padding: 16, alignItems: "center" },
  secondaryText: { color: C.violet, fontSize: 16, fontWeight: "800" },
  search: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "white", borderRadius: 30, paddingHorizontal: 18, height: 58, marginVertical: 16, shadowColor: C.violet, shadowOpacity: 0.08, shadowRadius: 18 },
  input: { flex: 1, color: C.ink, fontSize: 17 },
  section: { color: C.ink, fontSize: 24, fontWeight: "900", marginTop: 24, marginBottom: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  category: { width: "47.8%", height: 118, backgroundColor: C.card, borderRadius: 22, padding: 18, justifyContent: "space-between", borderWidth: 1, borderColor: C.line },
  categoryText: { color: C.ink, fontSize: 18, fontWeight: "900" },
  mini: { width: 210, minHeight: 210, marginRight: 14, backgroundColor: C.card, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: C.line },
  avatar: { width: 62, height: 62, borderRadius: 24, backgroundColor: C.peach, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  avatarBig: { width: 104, height: 104, borderRadius: 36, alignSelf: "center" },
  avatarText: { color: C.rose, fontSize: 20, fontWeight: "900" },
  avatarBigText: { fontSize: 34 },
  cardTitle: { color: C.ink, fontSize: 18, fontWeight: "900", marginBottom: 6 },
  muted: { color: C.muted, fontSize: 14 },
  centerMuted: { color: C.muted, fontSize: 17, lineHeight: 24, textAlign: "center" },
  price: { color: C.ink, fontSize: 18, fontWeight: "900", marginTop: 8 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  topTitle: { color: C.ink, fontSize: 20, fontWeight: "900" },
  iconBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.soft, alignItems: "center", justifyContent: "center" },
  iconGhost: { width: 48, height: 48 },
  filterBar: { flexDirection: "row", gap: 8, marginBottom: 12 },
  pill: { overflow: "hidden", backgroundColor: C.soft, color: C.ink, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 14, fontWeight: "800" },
  proRow: { flexDirection: "row", gap: 14, alignItems: "center", backgroundColor: C.card, borderRadius: 24, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: C.line },
  profileHero: { backgroundColor: C.card, borderRadius: 30, padding: 22, borderWidth: 1, borderColor: C.line },
  stats: { flexDirection: "row", justifyContent: "space-between", marginTop: 22, paddingTop: 18, borderTopWidth: 1, borderColor: C.line },
  stat: { alignItems: "center", flex: 1 },
  statValue: { color: C.ink, fontSize: 18, fontWeight: "900" },
  body: { color: C.ink, fontSize: 16, lineHeight: 24 },
  service: { backgroundColor: C.card, color: C.ink, borderRadius: 18, padding: 16, marginBottom: 10, fontSize: 16, fontWeight: "700", borderWidth: 1, borderColor: C.line },
  comment: { color: C.ink, backgroundColor: C.lilac, borderRadius: 18, padding: 16, marginBottom: 10, fontSize: 15 },
  sticky: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14, padding: 18, backgroundColor: "white", borderTopWidth: 1, borderColor: C.line },
  slot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.card, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: C.line },
  slotOn: { borderColor: C.violet, backgroundColor: C.lilac },
  slotText: { color: C.ink, fontSize: 16, fontWeight: "800" },
  payBox: { backgroundColor: C.card, borderRadius: 24, padding: 18, marginVertical: 18, borderWidth: 1, borderColor: C.line },
  total: { color: C.violet, fontSize: 38, fontWeight: "900", marginTop: 8 },
  chat: { flex: 1, padding: 18 },
  bubble: { maxWidth: "82%", padding: 14, borderRadius: 20, marginBottom: 12, fontSize: 16, lineHeight: 22, overflow: "hidden" },
  bubbleLeft: { color: C.ink, backgroundColor: C.card, alignSelf: "flex-start" },
  bubbleRight: { color: "white", backgroundColor: C.violet, alignSelf: "flex-end" },
  composer: { flexDirection: "row", gap: 10, padding: 16, backgroundColor: "white", borderTopWidth: 1, borderColor: C.line },
  composerInput: { flex: 1, backgroundColor: C.soft, borderRadius: 24, paddingHorizontal: 16, color: C.ink, fontSize: 16 },
  tokenCard: { alignItems: "center", backgroundColor: C.card, borderRadius: 30, padding: 28, borderWidth: 1, borderColor: C.line, marginTop: 18 },
  token: { color: C.ink, fontSize: 52, fontWeight: "900", letterSpacing: 6, marginVertical: 12 },
  textField: { backgroundColor: "white", borderRadius: 20, padding: 16, color: C.ink, fontSize: 16, borderWidth: 1, borderColor: C.line, marginBottom: 14 },
  area: { minHeight: 130, textAlignVertical: "top" },
  link: { color: C.violet, fontSize: 16, fontWeight: "900", textAlign: "center", marginTop: 18 },
  stars: { flexDirection: "row", gap: 8, justifyContent: "center", marginVertical: 28 }
});
