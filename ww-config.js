export default {
  editor: {
    label: {
      en: 'Parcours Steps List',
      fr: 'Liste des étapes du parcours',
    },
    icon: 'list',
  },
  triggerEvents: [
    {
      name: 'step-reorder',
      label: { en: 'On steps reorder', fr: 'Réorganisation des étapes' },
      event: { steps: [] },
      default: true,
    },
    {
      name: 'step-toggle-visibility',
      label: { en: 'On visibility toggle', fr: 'Changement de visibilité' },
      event: { stepId: '', visible: true },
    },
    {
      name: 'step-complete',
      label: { en: 'On step complete', fr: 'Étape terminée' },
      event: { stepId: '' },
    },
    {
      name: 'step-edit',
      label: { en: 'On step edit', fr: 'Modification étape' },
      event: { stepId: '' },
    },
    {
      name: 'step-delete',
      label: { en: 'On step delete', fr: 'Suppression étape' },
      event: { stepId: '' },
    },
    {
      name: 'resource-click',
      label: { en: 'On resource click', fr: 'Clic sur ressource' },
      event: {
        stepId: '',
        resource: {
          id: '',
          name: '',
          file_path: '',
          url: '',
          type: '',
          format: '',
        }
      },
    },
  ],
  properties: {
    // ===== DATA SECTION =====
    steps: {
      label: { en: 'Steps', fr: 'Étapes' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        {
          id: 'step-1',
          titre: 'Bilan initial et définition des objectifs',
          ordre: 1,
          statut: 'terminee',
          est_visible_beneficiaire: true,
          ressources: [
            { nom: 'Guide des métiers du numérique', type: 'PDF', size: '2621440', url: '#' },
            { nom: 'Template CV moderne', type: 'DOCX', size: '512000', url: '#' },
          ],
        },
        {
          id: 'step-2',
          titre: 'RDV Exploration des métiers',
          ordre: 2,
          statut: 'terminee',
          est_visible_beneficiaire: true,
          date: '30/10/2023 à 14:00',
          type_rdv: 'Distanciel',
          lien_visio: 'https://meet.example.com/rdv-123',
          est_rdv: true,
          ressources: [],
        },
        {
          id: 'step-3',
          titre: 'Identification des formations',
          ordre: 3,
          statut: 'en_cours',
          est_visible_beneficiaire: true,
          ressources: [{ nom: 'Liste des formations certifiantes', type: 'XLSX', size: '156000', url: '#' }],
        },
        {
          id: 'step-4',
          titre: 'Préparation du projet professionnel',
          ordre: 4,
          statut: 'a_faire',
          est_visible_beneficiaire: false,
          ressources: [],
        },
      ],
      options: {
        expandable: true,
        getItemLabel(item, index) {
          return item?.titre || item?.title || `Étape ${index + 1}`;
        },
        item: {
          type: 'Object',
          defaultValue: {
            id: '',
            titre: 'Nouvelle étape',
            ordre: 1,
            statut: 'a_faire',
            est_visible_beneficiaire: true,
          },
          options: {
            item: {
              id: { label: { en: 'ID' }, type: 'Text' },
              titre: { label: { en: 'Title', fr: 'Titre' }, type: 'Text' },
              ordre: { label: { en: 'Order', fr: 'Ordre' }, type: 'Number' },
              statut: { label: { en: 'Status', fr: 'Statut' }, type: 'Text' },
              est_visible_beneficiaire: {
                label: { en: 'Visible', fr: 'Visible' },
                type: 'OnOff',
              },
            },
          },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip:
          'Array of step objects. Each step should have id, title, order, status, and visibility fields.',
      },
      /* wwEditor:end */
    },

    // ===== FIELD MAPPING FORMULAS =====
    stepsIdFormula: {
      label: { en: 'ID Field', fr: 'Champ ID' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['id']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Formula to extract the ID from each step object',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the unique identifier for each step',
      },
      /* wwEditor:end */
    },
    stepsTitleFormula: {
      label: { en: 'Title Field', fr: 'Champ Titre' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['titre']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Formula to extract the title from each step object',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the step title',
      },
      /* wwEditor:end */
    },
    stepsOrderFormula: {
      label: { en: 'Order Field', fr: 'Champ Ordre' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['ordre']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Formula to extract the order/position from each step object',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the step order number',
      },
      /* wwEditor:end */
    },
    stepsStatusFormula: {
      label: { en: 'Status Field', fr: 'Champ Statut' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['statut']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Formula to extract the status from each step object',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the step status (e.g., terminee, en_cours)',
      },
      /* wwEditor:end */
    },
    stepsVisibleFormula: {
      label: { en: 'Visibility Field', fr: 'Champ Visibilité' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['est_visible_beneficiaire']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Formula to extract visibility status from each step object',
      },
      propertyHelp: {
        tooltip: 'Select the field that indicates if the step is visible to the beneficiary',
      },
      /* wwEditor:end */
    },
    stepsResourcesFormula: {
      label: { en: 'Resources Field', fr: 'Champ Ressources' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['ressources']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Formula to extract resources array from each step object',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the step resources (optional)',
      },
      /* wwEditor:end */
    },
    stepsDateFormula: {
      label: { en: 'Date Field', fr: 'Champ Date' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['date']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Formula to extract date from each step object',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the step date (optional)',
      },
      /* wwEditor:end */
    },
    stepsIsRdvFormula: {
      label: { en: 'Is RDV Field', fr: 'Champ Est RDV' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['est_rdv']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Formula to determine if step is a RDV (appointment)',
      },
      propertyHelp: {
        tooltip: 'Select the field that indicates if the step is an appointment',
      },
      /* wwEditor:end */
    },
    stepsRdvTypeFormula: {
      label: { en: 'RDV Type Field', fr: 'Champ Type RDV' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['type_rdv']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Formula to extract RDV type (Distanciel/Présentiel)',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the appointment type',
      },
      /* wwEditor:end */
    },
    stepsMeetingLinkFormula: {
      label: { en: 'Meeting Link Field', fr: 'Champ Lien Visio' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['lien_visio']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Formula to extract meeting/video conference link',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the video conference link',
      },
      /* wwEditor:end */
    },
    stepsIsCompletedFormula: {
      label: { en: 'Completed Field', fr: 'Champ Terminé' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['complete']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Formula to determine if step is completed (boolean)',
      },
      propertyHelp: {
        tooltip: 'Select the field that indicates if the step is completed (e.g., "complete")',
      },
      /* wwEditor:end */
    },
    stepsIsCoreFormula: {
      label: { en: 'Core Field', fr: 'Champ Core' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['core']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Formula to determine if step is a core step (cannot be edited/deleted)',
      },
      propertyHelp: {
        tooltip: 'Select the field that indicates if the step is a core step',
      },
      /* wwEditor:end */
    },
    stepsDateRdvFormula: {
      label: { en: 'RDV Date Field', fr: 'Champ Date RDV' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['date_rdv']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Formula to extract RDV date',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the appointment date',
      },
      /* wwEditor:end */
    },
    stepsHeureRdvFormula: {
      label: { en: 'RDV Time Field', fr: 'Champ Heure RDV' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template:
          Array.isArray(content?.steps) && content.steps.length > 0
            ? content.steps[0]
            : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['heure_rdv']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content?.steps) ||
        !content?.steps?.length ||
        !boundProps?.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Formula to extract RDV time',
      },
      propertyHelp: {
        tooltip: 'Select the field that contains the appointment time',
      },
      /* wwEditor:end */
    },

    // ===== FALLBACK FIELD PATHS (for non-bound data) =====
    idField: {
      label: { en: 'ID Property Path', fr: 'Chemin propriété ID' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'id',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for the step ID (e.g., "id" or "step_id")',
      },
      /* wwEditor:end */
    },
    titleField: {
      label: { en: 'Title Property Path', fr: 'Chemin propriété Titre' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'titre',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for the step title (e.g., "titre" or "title")',
      },
      /* wwEditor:end */
    },
    orderField: {
      label: { en: 'Order Property Path', fr: 'Chemin propriété Ordre' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'ordre',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for the step order (e.g., "ordre" or "order")',
      },
      /* wwEditor:end */
    },
    statusField: {
      label: { en: 'Status Property Path', fr: 'Chemin propriété Statut' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'statut',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for the step status (e.g., "statut" or "status")',
      },
      /* wwEditor:end */
    },
    visibleField: {
      label: { en: 'Visibility Property Path', fr: 'Chemin propriété Visibilité' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'est_visible_beneficiaire',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for visibility (e.g., "est_visible_beneficiaire" or "isVisible")',
      },
      /* wwEditor:end */
    },
    resourcesField: {
      label: { en: 'Resources Property Path', fr: 'Chemin propriété Ressources' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'ressources',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for resources array (e.g., "ressources" or "resources")',
      },
      /* wwEditor:end */
    },
    dateField: {
      label: { en: 'Date Property Path', fr: 'Chemin propriété Date' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'date',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for date (e.g., "date" or "scheduled_date")',
      },
      /* wwEditor:end */
    },
    isRdvField: {
      label: { en: 'Is RDV Property Path', fr: 'Chemin propriété Est RDV' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'est_rdv',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for RDV flag (e.g., "est_rdv" or "is_appointment")',
      },
      /* wwEditor:end */
    },
    rdvTypeField: {
      label: { en: 'RDV Type Property Path', fr: 'Chemin propriété Type RDV' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'type_rdv',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for RDV type (e.g., "type_rdv" or "meeting_type")',
      },
      /* wwEditor:end */
    },
    meetingLinkField: {
      label: { en: 'Meeting Link Property Path', fr: 'Chemin propriété Lien Visio' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'lien_visio',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for meeting link (e.g., "lien_visio" or "meeting_url")',
      },
      /* wwEditor:end */
    },
    isCompletedField: {
      label: { en: 'Completed Property Path', fr: 'Chemin propriété Terminé' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'complete',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for completed boolean (e.g., "complete" or "is_completed")',
      },
      /* wwEditor:end */
    },
    coreField: {
      label: { en: 'Core Property Path', fr: 'Chemin propriété Core' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'core',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for core flag (e.g., "core" or "is_core")',
      },
      /* wwEditor:end */
    },
    dateRdvField: {
      label: { en: 'RDV Date Property Path', fr: 'Chemin propriété Date RDV' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'date_rdv',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for RDV date (e.g., "date_rdv")',
      },
      /* wwEditor:end */
    },
    heureRdvField: {
      label: { en: 'RDV Time Property Path', fr: 'Chemin propriété Heure RDV' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'heure_rdv',
      hidden: (content, sidepanelContent, boundProps) => boundProps?.steps,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: 'Property path for RDV time (e.g., "heure_rdv")',
      },
      /* wwEditor:end */
    },

    // ===== COMPLETED STATUS VALUE =====
    completedStatusValue: {
      label: { en: 'Completed Status Value', fr: 'Valeur statut terminé' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'terminee',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The value that indicates a step is completed',
      },
      propertyHelp: {
        tooltip: 'The status value that marks a step as completed (e.g., "terminee", "completed")',
      },
      /* wwEditor:end */
    },

    // ===== SUPABASE STORAGE =====
    supabaseStorageUrl: {
      label: { en: 'Supabase Storage Base URL', fr: 'URL de base Supabase Storage' },
      type: 'Text',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Base URL for Supabase Storage (e.g., https://xxx.supabase.co/storage/v1/object/public/bucket/)',
      },
      propertyHelp: {
        tooltip: 'If your resources use file_path instead of full URL, enter the Supabase Storage base URL here. The file_path will be appended to this URL.',
      },
      /* wwEditor:end */
    },

    // ===== DISPLAY OPTIONS =====
    enableDragDrop: {
      label: { en: 'Enable Drag & Drop', fr: 'Activer glisser-déposer' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable or disable drag and drop reordering',
      },
      propertyHelp: {
        tooltip: 'Allow users to reorder steps by dragging',
      },
      /* wwEditor:end */
    },
    showVisibility: {
      label: { en: 'Show Visibility', fr: 'Afficher visibilité' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show or hide visibility badges and unlock button',
      },
      propertyHelp: {
        tooltip: 'Display visibility status and unlock button for each step',
      },
      /* wwEditor:end */
    },
    showActions: {
      label: { en: 'Show Actions', fr: 'Afficher actions' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show or hide action buttons',
      },
      propertyHelp: {
        tooltip: 'Display action buttons (complete, edit, delete) for each step',
      },
      /* wwEditor:end */
    },
    showResources: {
      label: { en: 'Show Resources', fr: 'Afficher ressources' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show or hide resource chips',
      },
      propertyHelp: {
        tooltip: 'Display resource chips for each step',
      },
      /* wwEditor:end */
    },
    showDate: {
      label: { en: 'Show Date', fr: 'Afficher date' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show or hide step dates',
      },
      propertyHelp: {
        tooltip: 'Display date information for each step',
      },
      /* wwEditor:end */
    },

    // ===== LABELS =====
    helpText: {
      label: { en: 'Help Text', fr: 'Texte d\'aide' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Glissez-déposez les étapes pour réorganiser le parcours',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Help text displayed at the top of the list',
      },
      /* wwEditor:end */
    },
    visibleText: {
      label: { en: 'Visible Badge Text', fr: 'Texte badge visible' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Visible par le bénéficiaire',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text shown when step is visible to beneficiary',
      },
      /* wwEditor:end */
    },
    hiddenText: {
      label: { en: 'Hidden Badge Text', fr: 'Texte badge masqué' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Masquée pour le bénéficiaire',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text shown when step is hidden from beneficiary',
      },
      /* wwEditor:end */
    },
    unlockText: {
      label: { en: 'Unlock Button Text', fr: 'Texte bouton débloquer' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Débloquer cette étape',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for the unlock/show step button',
      },
      /* wwEditor:end */
    },
    completeText: {
      label: { en: 'Complete Button Text', fr: 'Texte bouton terminer' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Marquer terminée',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for the mark as complete button',
      },
      /* wwEditor:end */
    },
    editText: {
      label: { en: 'Edit Button Text', fr: 'Texte bouton modifier' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Modifier',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for the edit button',
      },
      /* wwEditor:end */
    },
    deleteText: {
      label: { en: 'Delete Button Text', fr: 'Texte bouton supprimer' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Supprimer',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for the delete button',
      },
      /* wwEditor:end */
    },
    emptyText: {
      label: { en: 'Empty State Text', fr: 'Texte état vide' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Aucune étape dans ce parcours',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text shown when there are no steps',
      },
      /* wwEditor:end */
    },
    resourcesLabel: {
      label: { en: 'Resources Label', fr: 'Label ressources' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Ressources :',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Label shown before resource chips',
      },
      /* wwEditor:end */
    },
    openResourceText: {
      label: { en: 'Open Resource Text', fr: 'Texte ouvrir ressource' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Ouvrir',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for the open resource button',
      },
      /* wwEditor:end */
    },
    rdvBadgeText: {
      label: { en: 'RDV Badge Text', fr: 'Texte badge RDV' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'RDV',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text shown in the RDV badge',
      },
      /* wwEditor:end */
    },
    remoteBadgeText: {
      label: { en: 'Remote Badge Text', fr: 'Texte badge Distanciel' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Distanciel',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for remote/online meeting badge',
      },
      /* wwEditor:end */
    },
    onsiteBadgeText: {
      label: { en: 'On-site Badge Text', fr: 'Texte badge Présentiel' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Présentiel',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for on-site/in-person meeting badge',
      },
      /* wwEditor:end */
    },
    joinMeetingText: {
      label: { en: 'Join Meeting Text', fr: 'Texte rejoindre visio' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Rejoindre la visioconférence',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for the video conference link',
      },
      /* wwEditor:end */
    },
    remoteRdvValue: {
      label: { en: 'Remote RDV Value', fr: 'Valeur RDV Distanciel' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Distanciel',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The value that indicates a remote/online meeting',
      },
      propertyHelp: {
        tooltip: 'The type_rdv value for remote meetings (e.g., "Distanciel", "Remote", "Online")',
      },
      /* wwEditor:end */
    },

    // ===== STYLING =====
    cardBackground: {
      label: { en: 'Card Background', fr: 'Fond de carte' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color of step cards',
      },
      /* wwEditor:end */
    },
    cardBorderColor: {
      label: { en: 'Card Border Color', fr: 'Couleur bordure carte' },
      type: 'Color',
      section: 'style',
      defaultValue: '#e5e7eb',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border color of step cards',
      },
      /* wwEditor:end */
    },
    cardBorderRadius: {
      label: { en: 'Card Border Radius', fr: 'Rayon bordure carte' },
      type: 'Length',
      section: 'style',
      defaultValue: '8px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border radius of step cards',
      },
      /* wwEditor:end */
    },
    completedColor: {
      label: { en: 'Completed Status Color', fr: 'Couleur statut terminé' },
      type: 'Color',
      section: 'style',
      defaultValue: '#22c55e',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for completed status icon',
      },
      /* wwEditor:end */
    },
    visibleBadgeColor: {
      label: { en: 'Visible Badge Color', fr: 'Couleur badge visible' },
      type: 'Color',
      section: 'style',
      defaultValue: '#22c55e',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for visible badge',
      },
      /* wwEditor:end */
    },
    hiddenBadgeColor: {
      label: { en: 'Hidden Badge Color', fr: 'Couleur badge masqué' },
      type: 'Color',
      section: 'style',
      defaultValue: '#9ca3af',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for hidden badge',
      },
      /* wwEditor:end */
    },
    resourceChipBackground: {
      label: { en: 'Resource Chip Background', fr: 'Fond chip ressource' },
      type: 'Color',
      section: 'style',
      defaultValue: '#dbeafe',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color of resource chips',
      },
      /* wwEditor:end */
    },
    resourceChipTextColor: {
      label: { en: 'Resource Chip Text Color', fr: 'Couleur texte chip' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1d4ed8',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text color of resource chips',
      },
      /* wwEditor:end */
    },
    completeButtonColor: {
      label: { en: 'Complete Button Color', fr: 'Couleur bouton terminer' },
      type: 'Color',
      section: 'style',
      defaultValue: '#22c55e',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for complete button',
      },
      /* wwEditor:end */
    },
    editButtonColor: {
      label: { en: 'Edit Button Color', fr: 'Couleur bouton modifier' },
      type: 'Color',
      section: 'style',
      defaultValue: '#3b82f6',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for edit button',
      },
      /* wwEditor:end */
    },
    deleteButtonColor: {
      label: { en: 'Delete Button Color', fr: 'Couleur bouton supprimer' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ef4444',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for delete button',
      },
      /* wwEditor:end */
    },
    unlockButtonColor: {
      label: { en: 'Unlock Button Color', fr: 'Couleur bouton débloquer' },
      type: 'Color',
      section: 'style',
      defaultValue: '#3b82f6',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for unlock button',
      },
      /* wwEditor:end */
    },
    dragOverHighlightColor: {
      label: { en: 'Drag Over Highlight', fr: 'Surbrillance drag over' },
      type: 'Color',
      section: 'style',
      defaultValue: '#eff6ff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color when dragging over a card',
      },
      /* wwEditor:end */
    },
    rdvBadgeColor: {
      label: { en: 'RDV Badge Color', fr: 'Couleur badge RDV' },
      type: 'Color',
      section: 'style',
      defaultValue: '#8b5cf6',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color for RDV badge',
      },
      /* wwEditor:end */
    },
    rdvTypeBadgeColor: {
      label: { en: 'RDV Type Badge Color', fr: 'Couleur badge type RDV' },
      type: 'Color',
      section: 'style',
      defaultValue: '#6366f1',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color for RDV type badge (Distanciel/Présentiel)',
      },
      /* wwEditor:end */
    },
    meetingLinkColor: {
      label: { en: 'Meeting Link Color', fr: 'Couleur lien visio' },
      type: 'Color',
      section: 'style',
      defaultValue: '#22c55e',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for the video conference link',
      },
      /* wwEditor:end */
    },
  },
};
