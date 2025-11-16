import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DateRange, Granularity, KpiMetric, LogEvent, TopNewsItem } from './models';
import type { ChartData } from 'chart.js';

@Injectable({ providedIn: 'root' })
export class MetricsMockService {
  getKpis(range: DateRange): Observable<KpiMetric[]> {
    const totalAcessos = this.randomInRange(15000, 30000);
    const paginasVistas = this.randomInRange(35000, 70000);
    const visitantesUnicos = this.randomInRange(2000, 5000);
    const tempoMedio = this.randomInRange(120, 480); // segundos

    const kpis: KpiMetric[] = [
      { label: 'Acessos', value: totalAcessos, deltaPercent: this.randomDelta() },
      { label: 'Páginas Vistas', value: paginasVistas, deltaPercent: this.randomDelta() },
      { label: 'Visitantes Únicos', value: visitantesUnicos, deltaPercent: this.randomDelta() },
      { label: 'Tempo Médio (min)', value: Math.round(tempoMedio / 60), deltaPercent: this.randomDelta() },
    ];

    return of(kpis).pipe(delay(400));
  }

  getAccessSeries(range: DateRange, granularity: Granularity): Observable<ChartData<'line'>> {
    const labels: string[] = [];
    const values: number[] = [];

    for (const d of this.iterate(range, granularity)) {
      labels.push(this.formatLabel(d, granularity));
      values.push(this.randomInRange(100, 1000));
    }

    const data: ChartData<'line'> = {
      labels,
      datasets: [
        {
          label: 'Acessos',
          data: values,
          tension: 0.3,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,0.2)',
          fill: true,
        },
      ],
    };

    return of(data).pipe(delay(450));
  }

  getPagesSeries(range: DateRange, granularity: Granularity): Observable<ChartData<'bar'>> {
    const labels: string[] = [];
    const values: number[] = [];

    for (const d of this.iterate(range, granularity)) {
      labels.push(this.formatLabel(d, granularity));
      values.push(this.randomInRange(200, 1500));
    }

    const data: ChartData<'bar'> = {
      labels,
      datasets: [
        {
          label: 'Páginas Vistas',
          data: values,
          backgroundColor: '#22C55E',
          borderRadius: 6,
        },
      ],
    };

    return of(data).pipe(delay(450));
  }

  getTopNews(range: DateRange, size = 10): Observable<TopNewsItem[]> {
    const mockTitles = [
      'Prefeitura anuncia obras de revitalização na Avenida Principal',
      'Festival de Música atrai milhares de visitantes ao centro da cidade',
      'Novo hospital municipal será inaugurado no próximo mês',
      'Equipe local conquista campeonato estadual de futebol',
      'Empresas locais promovem feira de empregos com 500 vagas',
      'Projeto de educação ambiental beneficia escolas municipais',
      'Trânsito será alterado devido a evento cultural no fim de semana',
      'Câmara aprova orçamento para melhorias na infraestrutura urbana',
      'Centro cultural oferece oficinas gratuitas para jovens',
      'Parque municipal recebe melhorias e nova área de lazer',
      'Secretaria de Saúde promove campanha de vacinação',
      'Restaurante local ganha prêmio nacional de gastronomia',
      'Universidade federal abre inscrições para novos cursos',
      'Polícia Civil prende quadrilha especializada em furtos',
      'Meteorologia alerta para possibilidade de chuvas intensas',
    ];

    const items: TopNewsItem[] = Array.from({ length: Math.min(size, mockTitles.length) }).map((_, i) => ({
      title: mockTitles[i],
      slug: `noticia-${i + 1}`,
      views: this.randomInRange(500, 8000),
      lastAccess: this.randomDateInRange(range),
    }));
    return of(items).pipe(delay(500));
  }

  getLogs(range: DateRange, size = 12): Observable<LogEvent[]> {
    const actions = ['login', 'criou notícia', 'editou notícia', 'publicou', 'apagou', 'alterou menu', 'logout'];
    const users = ['ana', 'bruno', 'carla', 'diego', 'erika', 'felipe'];
    const events: LogEvent[] = Array.from({ length: size })
      .map(() => ({
        timestamp: this.randomDateInRange(range),
        user: users[this.randomInRange(0, users.length - 1)],
        action: actions[this.randomInRange(0, actions.length - 1)],
        detail: 'OK',
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return of(events).pipe(delay(350));
  }

  private *iterate(range: DateRange, granularity: Granularity): Generator<Date> {
    const start = new Date(range.start);
    const end = new Date(range.end);
    const cursor = new Date(start);
    while (cursor <= end) {
      yield new Date(cursor);
      if (granularity === 'day') {
        cursor.setDate(cursor.getDate() + 1);
      } else {
        cursor.setHours(cursor.getHours() + 1);
      }
    }
  }

  private formatLabel(d: Date, granularity: Granularity): string {
    return granularity === 'day'
      ? d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      : d.toLocaleTimeString('pt-BR', { hour: '2-digit' });
  }

  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomDateInRange(range: DateRange): Date {
    const startTime = range.start.getTime();
    const endTime = range.end.getTime();
    const t = this.randomInRange(startTime, endTime);
    return new Date(t);
  }

  private randomDelta(): number {
    const sign = Math.random() > 0.5 ? 1 : -1;
    return Math.round(Math.random() * 15 * sign);
  }
}
