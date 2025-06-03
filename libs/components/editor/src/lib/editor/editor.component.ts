import { 
  ChangeDetectorRef, 
  Component, 
  ViewEncapsulation, 
  type AfterViewInit, 
  ElementRef, 
  ViewChild 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  type EditorConfig,
  ClassicEditor,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  Bookmark,
  CloudServices,
  Code,
  CodeBlock,
  Emoji,
  Essentials,
  FindAndReplace,
  FullPage,
  Fullscreen,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Mention,
  Paragraph,
  PasteFromOffice,
  ShowBlocks,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline
} from 'ckeditor5';
import {
  CaseChange,
  DocumentOutline,
  ExportPdf,
  ExportWord,
  FormatPainter,
  ImportWord,
  MergeFields,
  PasteFromOfficeEnhanced,
  SlashCommand,
  SourceEditingEnhanced,
  TableOfContents,
  Template
} from 'ckeditor5-premium-features';

import translations from 'ckeditor5/dist/translations/pt-br.js';
import premiumFeaturesTranslations from 'ckeditor5-premium-features/dist/translations/pt-br.js';

const LICENSE_KEY =
  'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTAyMDQ3OTksImp0aSI6ImNkNDcxZTVmLWFlMWYtNDg5Zi1iNjBhLTZhNTM5MWU1ZDFlYyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImQ3YzMwMTQxIn0.Ry5eNx9kS-blAbFrNDyuezTlWb-bibzxTryv5sFPTD-7sqrp4BQrakxWMNssj3p-ShT8hoeNZWAlYgJLFO_pRw';

@Component({
  selector: 'lib-editor',
  imports: [CommonModule, CKEditorModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editorContainerElement') private editorContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('editorOutlineElement') private editorOutline!: ElementRef<HTMLDivElement>;

  constructor(private changeDetector: ChangeDetectorRef) {}

  public isLayoutReady = false;
  public Editor = ClassicEditor;
  public config: EditorConfig = {}; // CKEditor precisa da árvore DOM antes de calcular a configuração.

  public ngAfterViewInit(): void {
    this.config = {
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'insertMergeField',
          'previewMergeFields',
          '|',
          'sourceEditingEnhanced',
          'showBlocks',
          'formatPainter',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'link',
          'insertTable',
          'highlight',
          'blockQuote',
          'codeBlock',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'outdent',
          'indent'
        ],
        shouldNotGroupWhenFull: true
      },
      plugins: [
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        BalloonToolbar,
        BlockQuote,
        Bold,
        Bookmark,
        CaseChange,
        CloudServices,
        Code,
        CodeBlock,
        DocumentOutline,
        Emoji,
        Essentials,
        ExportPdf,
        ExportWord,
        FindAndReplace,
        FormatPainter,
        FullPage,
        Fullscreen,
        GeneralHtmlSupport,
        Heading,
        Highlight,
        HorizontalLine,
        HtmlComment,
        HtmlEmbed,
        ImageBlock,
        ImageCaption,
        ImageEditing,
        ImageInline,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        ImageUtils,
        ImportWord,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Mention,
        MergeFields,
        Paragraph,
        PasteFromOffice,
        PasteFromOfficeEnhanced,
        ShowBlocks,
        SlashCommand,
        SourceEditingEnhanced,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Table,
        TableCellProperties,
        TableOfContents,
        TableProperties,
        TableToolbar,
        Template,
        TextTransformation,
        TodoList,
        Underline
      ],
      balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
      documentOutline: {
        container: this.editorOutline.nativeElement
      },
      exportPdf: {
        stylesheets: [
          /* Este caminho deve apontar para as folhas de estilo de conteúdo no seu servidor de assets. */
          /* Veja: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-pdf.html */
          './export-style.css',
          /* Export PDF precisa de acesso às folhas de estilo que estilizam o conteúdo. */
          'https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.css',
          'https://cdn.ckeditor.com/ckeditor5-premium-features/45.1.0/ckeditor5-premium-features.css'
        ],
        fileName: 'export-pdf-demo.pdf',
        converterOptions: {
          format: 'Tabloid',
          margin_top: '20mm',
          margin_bottom: '20mm',
          margin_right: '24mm',
          margin_left: '24mm',
          page_orientation: 'portrait'
        }
      },
      exportWord: {
        stylesheets: [
          /* Este caminho deve apontar para as folhas de estilo de conteúdo no seu servidor de assets. */
          /* Veja: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-word.html */
          './export-style.css',
          /* Export Word precisa de acesso às folhas de estilo que estilizam o conteúdo. */
          'https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.css',
          'https://cdn.ckeditor.com/ckeditor5-premium-features/45.1.0/ckeditor5-premium-features.css'
        ],
        fileName: 'export-word-demo.docx',
        converterOptions: {
          document: {
            orientation: 'portrait',
            size: 'Tabloid',
            margins: {
              top: '20mm',
              bottom: '20mm',
              right: '24mm',
              left: '24mm'
            }
          }
        }
      },
      fullscreen: {
        onEnterCallback: container =>
          container.classList.add(
            'editor-container',
            'editor-container_classic-editor',
            'editor-container_include-outline',
            'editor-container_include-fullscreen',
            'main-container'
          )
      },
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Parágrafo',
            class: 'ck-heading_paragraph'
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Título 1',
            class: 'ck-heading_heading1'
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Título 2',
            class: 'ck-heading_heading2'
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Título 3',
            class: 'ck-heading_heading3'
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Título 4',
            class: 'ck-heading_heading4'
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Título 5',
            class: 'ck-heading_heading5'
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Título 6',
            class: 'ck-heading_heading6'
          }
        ]
      },
      htmlSupport: {
        allow: [
          {
            name: /^.*$/,
            styles: true,
            attributes: true,
            classes: true
          }
        ]
      },
      image: {
        toolbar: [
          'toggleImageCaption',
          'imageTextAlternative',
          '|',
          'imageStyle:inline',
          'imageStyle:wrapText',
          'imageStyle:breakText',
          '|',
          'resizeImage'
        ]
      },
      initialData:
        '<h2>Parabéns por configurar o CKEditor 5! 🎉</h2>\n<p>\n\tVocê criou com sucesso um projeto CKEditor 5. Este poderoso editor de texto\n\tirá aprimorar sua aplicação, permitindo recursos de edição de texto rico que\n\tsão personalizáveis e fáceis de usar.\n</p>\n<h3>O que vem a seguir?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integre em sua aplicação</strong>: hora de trazer a edição para\n\t\tsua aplicação. Pegue o código que você criou e adicione à sua aplicação.\n\t</li>\n\t<li>\n\t\t<strong>Explore recursos:</strong> Experimente diferentes plugins e\n\t\topções de barra de ferramentas para descobrir o que funciona melhor para suas necessidades.\n\t</li>\n\t<li>\n\t\t<strong>Personalize seu editor:</strong> Adapte a configuração do editor\n\t\tpara corresponder ao estilo e requisitos da sua aplicação. Ou\n\t\taté mesmo escreva seu próprio plugin!\n\t</li>\n</ol>\n<p>\n\tContinue experimentando, e não hesite em expandir os limites do que você\n\tpode alcançar com o CKEditor 5. Seu feedback é inestimável para nós enquanto nos esforçamos\n\tpara melhorar e evoluir. Boa edição!\n</p>\n<h3>Recursos úteis</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Cadastro para teste</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentação</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (nos dê uma estrela se puder!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">Página inicial do CKEditor</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">Demos do CKEditor 5</a>,</li>\n</ul>\n<h3>Precisa de ajuda?</h3>\n<p>\n\tVê este texto, mas o editor não está iniciando? Verifique o console do navegador\n\tpara pistas e orientação. Pode estar relacionado a uma chave de licença incorreta\n\tse você usar recursos premium ou outro requisito relacionado ao recurso. Se\n\tvocê não conseguir fazê-lo funcionar, abra uma issue no GitHub, e ajudaremos o mais rápido\n\tpossível!\n</p>',
      language: 'pt-br',
      licenseKey: LICENSE_KEY,
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          toggleDownloadable: {
            mode: 'manual',
            label: 'Baixável',
            attributes: {
              download: 'file'
            }
          }
        }
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true
        }
      },
      mention: {
        feeds: [
          {
            marker: '@',
            feed: [
              /* Veja: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
            ]
          }
        ]
      },
      menuBar: {
        isVisible: true
      },
      mergeFields: {
        /* Leia mais: https://ckeditor.com/docs/ckeditor5/latest/features/merge-fields.html#configuration */
      },
      placeholder: 'Digite ou cole seu conteúdo aqui!',
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
      },
      template: {
        definitions: [
          {
            title: 'Introdução',
            description: 'Introdução simples para um artigo',
            icon: '<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <g id="icons/article-image-right">\n        <rect id="icon-bg" width="45" height="45" rx="2" fill="#A5E7EB"/>\n        <g id="page" filter="url(#filter0_d_1_507)">\n            <path d="M9 41H36V12L28 5H9V41Z" fill="white"/>\n            <path d="M35.25 12.3403V40.25H9.75V5.75H27.7182L35.25 12.3403Z" stroke="#333333" stroke-width="1.5"/>\n        </g>\n        <g id="image">\n            <path id="Rectangle 22" d="M21.5 23C21.5 22.1716 22.1716 21.5 23 21.5H31C31.8284 21.5 32.5 22.1716 32.5 23V29C32.5 29.8284 31.8284 30.5 31 30.5H23C22.1716 30.5 21.5 29.8284 21.5 29V23Z" fill="#B6E3FC" stroke="#333333"/>\n            <path id="Vector 1" d="M24.1184 27.8255C23.9404 27.7499 23.7347 27.7838 23.5904 27.9125L21.6673 29.6268C21.5124 29.7648 21.4589 29.9842 21.5328 30.178C21.6066 30.3719 21.7925 30.5 22 30.5H32C32.2761 30.5 32.5 30.2761 32.5 30V27.7143C32.5 27.5717 32.4391 27.4359 32.3327 27.3411L30.4096 25.6268C30.2125 25.451 29.9127 25.4589 29.7251 25.6448L26.5019 28.8372L24.1184 27.8255Z" fill="#44D500" stroke="#333333" stroke-linejoin="round"/>\n            <circle id="Ellipse 1" cx="26" cy="25" r="1.5" fill="#FFD12D" stroke="#333333"/>\n        </g>\n        <rect id="Rectangle 23" x="13" y="13" width="12" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 24" x="13" y="17" width="19" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 25" x="13" y="21" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 26" x="13" y="25" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 27" x="13" y="29" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 28" x="13" y="33" width="16" height="2" rx="1" fill="#B4B4B4"/>\n    </g>\n    <defs>\n        <filter id="filter0_d_1_507" x="9" y="5" width="28" height="37" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n            <feFlood flood-opacity="0" result="BackgroundImageFix"/>\n            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>\n            <feOffset dx="1" dy="1"/>\n            <feComposite in2="hardAlpha" operator="out"/>\n            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.29 0"/>\n            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_507"/>\n            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_507" result="shape"/>\n        </filter>\n    </defs>\n</svg>\n',
            data: "<h2>Introdução</h2><p>No mundo acelerado de hoje, acompanhar as últimas tendências e insights é essencial tanto para o crescimento pessoal quanto para o desenvolvimento profissional. Este artigo tem como objetivo esclarecer um tópico que ressoa com muitos, fornecendo informações valiosas e conselhos práticos. Seja você buscando aprimorar seu conhecimento, melhorar suas habilidades ou simplesmente se manter informado, nossa análise abrangente oferece um mergulho profundo no assunto, projetado para capacitar e inspirar nossos leitores.</p>"
          }
        ]
      },
      translations: [translations, premiumFeaturesTranslations]
    };

    this.configUpdateAlert(this.config);

    this.isLayoutReady = true;
    this.changeDetector.detectChanges();
  }

  /**
   * Esta função existe para lembrá-lo de atualizar a configuração necessária para recursos premium.
   * A função pode ser removida com segurança. Certifique-se de também remover a chamada para esta função ao fazê-lo.
   */
  private configUpdateAlert(config: any): void {
    if ((this.configUpdateAlert as any).configUpdateAlertShown) {
      return;
    }

    const isModifiedByUser = (currentValue: string | undefined, forbiddenValue: string) => {
      if (currentValue === forbiddenValue) {
        return false;
      }

      if (currentValue === undefined) {
        return false;
      }

      return true;
    };

    const valuesToUpdate: string[] = [];

    (this.configUpdateAlert as any).configUpdateAlertShown = true;

    if (!isModifiedByUser(config.licenseKey, '<YOUR_LICENSE_KEY>')) {
      valuesToUpdate.push('LICENSE_KEY');
    }

    if (valuesToUpdate.length) {
      window.alert(
        [
          'Por favor, atualize os seguintes valores na configuração do seu editor',
          'para receber acesso completo aos Recursos Premium:',
          '',
          ...valuesToUpdate.map(value => ` - ${value}`)
        ].join('\n')
      );
    }
  }
}
