import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { News, NewsMedia } from '@site-gazeta/models';
import { SanitizeUrlPipe } from '../../pipes/sanitize-url.pipe';


@Component({
  selector: 'app-news-content',
  imports: [CommonModule, SanitizeUrlPipe],
  templateUrl: './news-content.component.html',
  styleUrl: './news-content.component.scss'
})
export class NewsContentComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);

  // Signal para armazenar a notícia
  news = signal<News | null>(null);
  
  // Signal para controlar loading
  isLoading = signal<boolean>(true);

  // Computed signal para obter a mídia em destaque
  emphasisMedia = computed(() => {
    const currentNews = this.news();
    if (!currentNews) return null;
    return currentNews.mediaNews.find((media: NewsMedia) => media.emphasis);
  });

  // Computed signal para outras mídias
  otherMedias = computed(() => {
    const currentNews = this.news();
    if (!currentNews) return [];
    return currentNews.mediaNews.filter((media: NewsMedia) => !media.emphasis);
  });

  ngOnInit(): void {
    // Preparado para receber o slug da rota
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      
      if (slug) {
        // TODO: Aqui será feita a chamada para o backend
        // this.newsService.getNewsBySlug(slug).subscribe(...)
        this.loadMockNews();
      } else {
        // Carregar notícia mockada para desenvolvimento
        this.loadMockNews();
      }
    });
  }

  private loadMockNews(): void {
    // Simular delay de carregamento
    setTimeout(() => {
      this.news.set({
        id: 1,
        title: 'Cidade inaugura novo parque ecológico com área de 50 mil m²',
        subtitle: 'Espaço conta com trilhas, playground e área para piquenique, aberto ao público a partir de segunda-feira',
        content: `
          <p>A cidade ganhou neste sábado (5) um novo parque ecológico que promete ser um dos principais pontos de lazer e contato com a natureza para os moradores. Com uma área de 50 mil metros quadrados, o Parque Municipal Verde Vida foi inaugurado pela prefeitura com a presença de autoridades e centenas de visitantes.</p>
          
          <p>O espaço conta com diversas atrações, incluindo trilhas ecológicas que percorrem toda a extensão do parque, playground infantil com equipamentos modernos e seguros, quadras poliesportivas, pista de caminhada e ciclovia. Há também áreas especialmente preparadas para piqueniques familiares, com mesas e bancos distribuídos estrategicamente sob a sombra de árvores nativas.</p>
          
          <h2>Preservação ambiental</h2>
          
          <p>Durante a cerimônia de inauguração, o prefeito destacou que o projeto foi desenvolvido com foco na preservação ambiental. "Mantivemos 80% da vegetação original e realizamos o plantio de mais de 300 mudas de árvores nativas. Este é um espaço que pertence ao povo e que deve ser preservado por todos", afirmou.</p>
          
          <p>O parque também conta com uma equipe de monitores ambientais que realizarão visitas guiadas e atividades educativas, especialmente voltadas para grupos escolares. A expectativa é que o local receba cerca de 2 mil visitantes por semana.</p>
          
          <h2>Infraestrutura completa</h2>
          
          <p>A infraestrutura do parque inclui estacionamento com 100 vagas, banheiros adaptados para pessoas com deficiência, lanchonete, bebedouros e um posto da Guarda Municipal para garantir a segurança dos frequentadores.</p>
          
          <p>O horário de funcionamento será de terça a domingo, das 6h às 20h. A entrada é gratuita e não é necessário agendamento prévio, exceto para grupos escolares que desejarem participar das atividades educativas monitoradas.</p>
          
          <p>Moradores que participaram da inauguração demonstraram entusiasmo com o novo espaço. "É maravilhoso ter um lugar assim tão perto de casa, onde podemos trazer as crianças com segurança e aproveitar a natureza", comemorou Maria Silva, moradora do bairro.</p>
        `,
        categoryId: [1, 3],
        author: 'João Silva',
        mediaNews: [
          {
            id: 1,
            idNews: 1,
            emphasis: true,
            author: 'Carlos Mendes',
            date: '2025-10-05',
            imgSize: {
              original: '/img/logo02.webp',
              small: '/img/logo02.webp',
              medium: '/img/logo02.webp',
              superSmall: '/img/logo02.webp'
            }
          },
          {
            id: 2,
            idNews: 1,
            emphasis: false,
            author: 'Ana Paula',
            date: '2025-10-05',
            imgSize: {
              original: '/img/logo01.png',
              small: '/img/logo01.png',
              medium: '/img/logo01.png',
              superSmall: '/img/logo01.png'
            }
          }
        ],
        videoNews: [
          {
            id: 1,
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            title: 'Vídeo 1',
            duration: '10:00'
          }
        ],
        published: '2025-10-05T10:30:00',
        createdAt: '2025-10-04T15:20:00',
        updateAt: '2025-10-05T09:15:00',
        views: 1523,
        status: 'published',
        slug: 'cidade-inaugura-novo-parque-ecologico',
        isEmphasis: true
      });
      this.isLoading.set(false);
    }, 500);
  }

  // Método utilitário para formatar a data
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para formatar número de visualizações
  formatViews(views: number): string {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  }

  // Método para voltar para a página anterior
  goBack(): void {
    this.router.navigate(['/']);
  }
}
