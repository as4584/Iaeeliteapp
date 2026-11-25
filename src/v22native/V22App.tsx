// Damian's v22 design, built natively. Mirrors his goTo()/bookService()/closeSuccess() flow:
// five tabs plus the legal page, one screen visible at a time, form state kept across tabs.
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomNav } from './BottomNav';
import { emptyForm, type RequestForm, type Screen, type Tab } from './content';
import { BlackCar } from './screens/BlackCar';
import { Connect } from './screens/Connect';
import { Home } from './screens/Home';
import { Legal } from './screens/Legal';
import { Request } from './screens/Request';
import { Services } from './screens/Services';
import { Success } from './Success';
import { c } from './theme';

export default function V22App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [form, setForm] = useState<RequestForm>(emptyForm);
  const [sent, setSent] = useState(false);
  const [statsPlayed, setStatsPlayed] = useState(false);
  const onStatsPlayed = useCallback(() => setStatsPlayed(true), []);

  const go = (s: Screen) => setScreen(s);
  const book = (service: string) => {
    setForm((f) => ({ ...f, service }));
    setScreen('request');
  };
  const closeSuccess = () => {
    setSent(false);
    setForm(emptyForm);
    setScreen('home');
  };

  return (
    <View style={styles.app}>
      <View style={styles.screens}>
        {screen === 'home' && <Home go={go} statsPlayed={statsPlayed} onStatsPlayed={onStatsPlayed} />}
        {screen === 'services' && <Services go={go} book={book} />}
        {screen === 'blackcar' && <BlackCar book={book} />}
        {screen === 'request' && <Request form={form} setForm={setForm} onSent={() => setSent(true)} openLegal={() => go('legal')} />}
        {screen === 'connect' && <Connect goRequest={() => go('request')} openLegal={() => go('legal')} />}
        {screen === 'legal' && <Legal back={() => go('connect')} />}
      </View>
      <BottomNav active={screen === 'legal' ? null : (screen as Tab)} go={go} />
      <Success visible={sent} onDone={closeSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: c.bg },
  screens: { flex: 1, overflow: 'hidden' },
});
