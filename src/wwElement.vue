<template>
  <div class="parcours-steps-list" :style="cssVariables">
    <!-- Help Text Header -->
    <div v-if="content?.helpText && content?.enableDragDrop !== false" class="help-text">
      <span class="help-icon">&#x1F4A1;</span>
      {{ content?.helpText }}
    </div>

    <!-- Empty State -->
    <div v-if="!localSteps?.length" class="empty-state">
      {{ content?.emptyText || 'Aucune étape dans ce parcours' }}
    </div>

    <!-- Steps List -->
    <div v-else class="steps-container">
      <div
        v-for="(step, index) in localSteps"
        :key="step.id"
        class="step-card"
        :class="{
          'drag-over': dragOverIndex === index,
          'dragging': draggedIndex === index,
        }"
        :draggable="content?.enableDragDrop !== false"
        @dragstart="handleDragStart($event, index)"
        @dragend="handleDragEnd"
        @dragover="handleDragOver($event, index)"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, index)"
      >
        <!-- Drag Handle -->
        <div
          v-if="content?.enableDragDrop !== false"
          class="drag-handle"
          @mousedown.stop
        >
          <span class="handle-dots">&#x22EE;&#x22EE;</span>
        </div>

        <!-- Card Content -->
        <div class="card-content">
          <!-- Header Row -->
          <div class="card-header">
            <!-- Status Icon (clickable to toggle completion) -->
            <button
              class="status-icon-btn"
              :class="{ completed: step.isCompleted }"
              @click.stop="handleToggleComplete(step.id, !step.isCompleted)"
              :title="step.isCompleted ? 'Marquer comme non terminée' : 'Marquer comme terminée'"
            >
              <svg v-if="step.isCompleted" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>

            <!-- Title -->
            <h3 class="step-title">{{ step.order }}. {{ step.title }}</h3>

            <!-- RDV Badge (if applicable) -->
            <span v-if="step.isRdv" class="rdv-badge">
              <svg class="rdv-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
              </svg>
              {{ content?.rdvBadgeText || 'RDV' }}
            </span>

            <!-- Date Badge (right aligned) -->
            <span v-if="content?.showDate !== false && step.date" class="date-badge date-right">
              [{{ step.date?.split(' ')[0] || step.date }}]
            </span>
          </div>

          <!-- RDV Details Section -->
          <div v-if="step.isRdv" class="rdv-details-section">
            <!-- Date/Time with icon -->
            <div v-if="step.date" class="rdv-datetime">
              <svg class="datetime-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
              </svg>
              <span>{{ step.date }}</span>

              <!-- RDV Type Badge -->
              <span v-if="step.rdvType" class="rdv-type-badge" :class="{ remote: isRemoteRdv(step) }">
                <svg v-if="isRemoteRdv(step)" class="type-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"/>
                </svg>
                <svg v-else class="type-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {{ getRdvTypeLabel(step) }}
              </span>
            </div>

            <!-- Meeting Link -->
            <a
              v-if="step.meetingLink && isRemoteRdv(step)"
              :href="step.meetingLink"
              target="_blank"
              rel="noopener noreferrer"
              class="meeting-link"
              @click.stop
            >
              <svg class="link-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              {{ content?.joinMeetingText || 'Rejoindre la visioconférence' }}
            </a>
          </div>

          <!-- Resources Section -->
          <div
            v-if="content?.showResources !== false && step.resources?.length"
            class="resources-section"
          >
            <div class="resources-list">
              <button
                v-for="(resource, rIndex) in step.resources"
                :key="rIndex"
                type="button"
                class="resource-card"
                @click.stop="handleResourceClick(step.id, resource)"
              >
                <!-- File Icon -->
                <div class="resource-file-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                </div>
                <!-- File Info -->
                <div class="resource-info">
                  <span class="resource-name">{{ getResourceName(resource) }}</span>
                  <span class="resource-meta">
                    {{ getResourceType(resource) || 'Fichier' }}
                    <span v-if="getResourceSize(resource)"> • {{ getResourceSize(resource) }}</span>
                  </span>
                </div>
                <!-- Open Button -->
                <span class="resource-open-btn">
                  <span class="open-dot"></span>
                  {{ content?.openResourceText || 'Ouvrir' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Visibility Section (clickable to toggle) -->
          <div v-if="content?.showVisibility !== false" class="visibility-section">
            <button
              class="visibility-badge-btn"
              :class="{ visible: step.isVisible, hidden: !step.isVisible }"
              @click.stop="handleToggleVisibility(step.id, !step.isVisible)"
              :title="step.isVisible ? 'Masquer pour le bénéficiaire' : 'Rendre visible pour le bénéficiaire'"
            >
              <!-- Eye icon (visible) -->
              <svg v-if="step.isVisible" class="visibility-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <!-- Eye off icon (hidden) -->
              <svg v-else class="visibility-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
              <span>{{ step.isVisible ? (content?.visibleText || 'Visible pour le bénéficiaire') : (content?.hiddenText || 'Masqué pour le bénéficiaire') }}</span>
            </button>
          </div>

          <!-- Actions Section -->
          <div v-if="content?.showActions !== false" class="actions-section">
            <button
              v-if="!step.isCompleted"
              class="action-button complete-button"
              @click.stop="handleComplete(step.id)"
            >
              <span class="button-icon">&#x2713;</span>
              {{ content?.completeText || 'Marquer terminée' }}
            </button>
            <button
              v-if="step.canEdit"
              class="action-button edit-button"
              @click.stop="handleEdit(step.id)"
            >
              <span class="button-icon">&#x270E;</span>
              {{ content?.editText || 'Modifier' }}
            </button>
            <button
              v-if="step.canDelete"
              class="action-button delete-button"
              @click.stop="handleDelete(step.id)"
            >
              <span class="button-icon">&#x1F5D1;</span>
              {{ content?.deleteText || 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // ===== DRAG & DROP STATE =====
    const draggedIndex = ref(null);
    const dragOverIndex = ref(null);

    // ===== HELPER: Get nested property by path =====
    const getNestedValue = (obj, path) => {
      if (!obj || !path) return undefined;
      const keys = String(path).split('.');
      let value = obj;
      for (const key of keys) {
        if (value == null) return undefined;
        value = value[key];
      }
      return value;
    };

    // ===== HELPER: Normalize resources to array =====
    // Handles: array, single object (from Supabase join), or null/undefined
    const normalizeResources = (resources) => {
      if (!resources) return [];
      if (Array.isArray(resources)) return resources.filter(r => r != null);
      if (typeof resources === 'object') return [resources]; // Single object from join
      return [];
    };

    // ===== PROCESSED STEPS (normalized from raw data) =====
    const processedSteps = computed(() => {
      const rawSteps = props.content?.steps;
      if (!Array.isArray(rawSteps) || !rawSteps.length) return [];

      const completedValue = props.content?.completedStatusValue || 'terminee';

      // Field paths (for non-bound data)
      const idPath = props.content?.idField || 'id';
      const titlePath = props.content?.titleField || 'titre';
      const orderPath = props.content?.orderField || 'ordre';
      const statusPath = props.content?.statusField || 'statut';
      const visiblePath = props.content?.visibleField || 'est_visible_beneficiaire';
      const resourcesPath = props.content?.resourcesField || 'ressources';
      const datePath = props.content?.dateField || 'date';
      const isRdvPath = props.content?.isRdvField || 'est_rdv';
      const rdvTypePath = props.content?.rdvTypeField || 'type_rdv';
      const meetingLinkPath = props.content?.meetingLinkField || 'lien_visio';
      const isCompletedPath = props.content?.isCompletedField || 'complete';
      const corePath = props.content?.coreField || 'core';
      const dateRdvPath = props.content?.dateRdvField || 'date_rdv';
      const heureRdvPath = props.content?.heureRdvField || 'heure_rdv';

      // Try to use formula mapping if available (for bound data)
      let resolveMappingFormula = null;
      /* wwEditor:start */
      try {
        const formulaUtils = wwLib?.wwFormula?.useFormula?.();
        if (formulaUtils?.resolveMappingFormula) {
          resolveMappingFormula = formulaUtils.resolveMappingFormula;
        }
      } catch (e) {
        // Formula utils not available
      }
      /* wwEditor:end */

      return rawSteps.map((item, index) => {
        // Try formula first, then fallback to path lookup
        let id, title, order, status, isVisible, resources, date, isRdv, rdvType, meetingLink;
        let isCompletedFormula, isCore, dateRdv, heureRdv;

        if (resolveMappingFormula) {
          id = resolveMappingFormula(props.content?.stepsIdFormula, item);
          title = resolveMappingFormula(props.content?.stepsTitleFormula, item);
          order = resolveMappingFormula(props.content?.stepsOrderFormula, item);
          status = resolveMappingFormula(props.content?.stepsStatusFormula, item);
          isVisible = resolveMappingFormula(props.content?.stepsVisibleFormula, item);
          resources = resolveMappingFormula(props.content?.stepsResourcesFormula, item);
          date = resolveMappingFormula(props.content?.stepsDateFormula, item);
          isRdv = resolveMappingFormula(props.content?.stepsIsRdvFormula, item);
          rdvType = resolveMappingFormula(props.content?.stepsRdvTypeFormula, item);
          meetingLink = resolveMappingFormula(props.content?.stepsMeetingLinkFormula, item);
          isCompletedFormula = resolveMappingFormula(props.content?.stepsIsCompletedFormula, item);
          isCore = resolveMappingFormula(props.content?.stepsIsCoreFormula, item);
          dateRdv = resolveMappingFormula(props.content?.stepsDateRdvFormula, item);
          heureRdv = resolveMappingFormula(props.content?.stepsHeureRdvFormula, item);
        }

        // Fallback to path-based lookup
        id = id ?? getNestedValue(item, idPath) ?? item?.id ?? `step-${index}`;
        title = title ?? getNestedValue(item, titlePath) ?? item?.titre ?? item?.title ?? 'Sans titre';
        order = order ?? getNestedValue(item, orderPath) ?? item?.ordre ?? item?.order ?? (index + 1);
        status = status ?? getNestedValue(item, statusPath) ?? item?.statut ?? item?.status ?? '';
        isVisible = isVisible ?? getNestedValue(item, visiblePath) ?? item?.est_visible_beneficiaire ?? item?.isVisible ?? item?.visible ?? true;
        resources = resources ?? getNestedValue(item, resourcesPath) ?? item?.ressources ?? item?.resources ?? [];
        date = date ?? getNestedValue(item, datePath) ?? item?.date ?? null;
        isRdv = isRdv ?? getNestedValue(item, isRdvPath) ?? item?.est_rdv ?? item?.isRdv ?? item?.is_rdv ?? false;
        rdvType = rdvType ?? getNestedValue(item, rdvTypePath) ?? item?.type_rdv ?? item?.rdvType ?? item?.meeting_type ?? null;
        meetingLink = meetingLink ?? getNestedValue(item, meetingLinkPath) ?? item?.lien_visio ?? item?.meetingLink ?? item?.meeting_link ?? null;
        isCompletedFormula = isCompletedFormula ?? getNestedValue(item, isCompletedPath) ?? item?.complete ?? item?.is_completed ?? null;
        isCore = isCore ?? getNestedValue(item, corePath) ?? item?.core ?? item?.is_core ?? false;
        dateRdv = dateRdv ?? getNestedValue(item, dateRdvPath) ?? item?.date_rdv ?? null;
        heureRdv = heureRdv ?? getNestedValue(item, heureRdvPath) ?? item?.heure_rdv ?? null;

        // Auto-detect RDV if rdvType exists but isRdv is not explicitly set
        const finalIsRdv = Boolean(isRdv) || Boolean(rdvType) || Boolean(dateRdv) || Boolean(heureRdv);

        // Determine completed status: use boolean field if available, otherwise compare status string
        let finalIsCompleted;
        if (isCompletedFormula !== null && isCompletedFormula !== undefined) {
          finalIsCompleted = Boolean(isCompletedFormula);
        } else {
          finalIsCompleted = String(status).toLowerCase() === String(completedValue).toLowerCase();
        }

        // Core flag - prevents edit/delete for core steps
        const finalIsCore = Boolean(isCore);

        // Build combined date string for RDV (date + time)
        let combinedDate = date;
        if (finalIsRdv && (dateRdv || heureRdv)) {
          const datePart = dateRdv ? String(dateRdv) : '';
          const timePart = heureRdv ? String(heureRdv) : '';
          if (datePart && timePart) {
            combinedDate = `${datePart} à ${timePart}`;
          } else if (datePart) {
            combinedDate = datePart;
          } else if (timePart) {
            combinedDate = timePart;
          }
        }

        return {
          id: String(id),
          title: String(title),
          order: Number(order) || (index + 1),
          status: String(status || ''),
          isVisible: Boolean(isVisible),
          isCompleted: finalIsCompleted,
          // Normalize resources: handle array, single object, or null/undefined
          resources: normalizeResources(resources),
          date: combinedDate ? String(combinedDate) : null,
          isRdv: finalIsRdv,
          rdvType: rdvType ? String(rdvType) : null,
          meetingLink: meetingLink ? String(meetingLink) : null,
          core: finalIsCore,
          canEdit: !finalIsCore,
          canDelete: !finalIsCore,
          originalItem: item,
        };
      }).sort((a, b) => a.order - b.order);
    });

    // ===== LOCAL STEPS (for drag & drop manipulation) =====
    const localSteps = ref([]);

    // Sync local steps when processed steps change
    watch(
      processedSteps,
      (newSteps) => {
        localSteps.value = [...newSteps];
      },
      { immediate: true, deep: true }
    );

    // ===== RESOURCE HELPERS =====
    const getResourceName = (resource) => {
      if (typeof resource === 'string') return resource;
      return resource?.nom ?? resource?.name ?? resource?.titre ?? resource?.title ?? 'Ressource';
    };

    const getResourceType = (resource) => {
      if (typeof resource === 'string') return null;
      // Support Supabase: format, type fields
      // Also support: extension, mime_type
      const format = resource?.format ?? resource?.type ?? resource?.extension ?? null;
      if (format) return String(format).toUpperCase();
      if (resource?.mime_type) return resource.mime_type.split('/').pop()?.toUpperCase();
      return null;
    };

    const getResourceUrl = (resource) => {
      if (typeof resource === 'string') return resource;
      // Return full URL if available, otherwise file_path for workflow to handle
      return resource?.url ?? resource?.file_path ?? resource?.href ?? resource?.link ?? resource?.path ?? resource?.src ?? '#';
    };

    const getResourceSize = (resource) => {
      if (typeof resource === 'string') return null;
      const size = resource?.size ?? resource?.fileSize ?? resource?.file_size ?? null;
      if (!size) return null;

      // Convert bytes to human readable format
      const bytes = Number(size);
      if (isNaN(bytes)) return size; // Already formatted
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    };

    // ===== RDV HELPERS =====
    const isRemoteRdv = (step) => {
      const remoteValue = props.content?.remoteRdvValue || 'Distanciel';
      const rdvType = step?.rdvType || '';
      return rdvType.toLowerCase() === remoteValue.toLowerCase() ||
             rdvType.toLowerCase() === 'remote' ||
             rdvType.toLowerCase() === 'online' ||
             rdvType.toLowerCase() === 'visio';
    };

    const getRdvTypeLabel = (step) => {
      const rdvType = step?.rdvType || '';
      const remoteValue = props.content?.remoteRdvValue || 'Distanciel';

      if (isRemoteRdv(step)) {
        return props.content?.remoteBadgeText || 'Distanciel';
      }
      return props.content?.onsiteBadgeText || rdvType || 'Présentiel';
    };

    // ===== DRAG & DROP HANDLERS =====
    const handleDragStart = (event, index) => {
      if (props.content?.enableDragDrop === false) return;
      draggedIndex.value = index;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragEnd = () => {
      draggedIndex.value = null;
      dragOverIndex.value = null;
    };

    const handleDragOver = (event, index) => {
      if (props.content?.enableDragDrop === false) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      if (draggedIndex.value !== index) {
        dragOverIndex.value = index;
      }
    };

    const handleDragLeave = () => {
      dragOverIndex.value = null;
    };

    const handleDrop = (event, dropIndex) => {
      if (props.content?.enableDragDrop === false) return;
      event.preventDefault();

      const fromIndex = draggedIndex.value;
      if (fromIndex === null || fromIndex === dropIndex) {
        handleDragEnd();
        return;
      }

      // Reorder local steps
      const newSteps = [...localSteps.value];
      const [movedItem] = newSteps.splice(fromIndex, 1);
      newSteps.splice(dropIndex, 0, movedItem);

      // Recalculate order values
      const reorderedSteps = newSteps.map((step, idx) => ({
        ...step,
        order: idx + 1,
      }));

      localSteps.value = reorderedSteps;

      // Emit trigger with reordered steps
      emit('trigger-event', {
        name: 'step-reorder',
        event: {
          steps: reorderedSteps.map((step) => ({
            id: step.id,
            order: step.order,
            originalItem: step.originalItem,
          })),
        },
      });

      handleDragEnd();
    };

    // ===== ACTION HANDLERS =====
    const handleToggleVisibility = (stepId, visible) => {
      emit('trigger-event', {
        name: 'step-toggle-visibility',
        event: { stepId, visible },
      });
    };

    const handleComplete = (stepId) => {
      emit('trigger-event', {
        name: 'step-complete',
        event: { stepId },
      });
    };

    const handleToggleComplete = (stepId, completed) => {
      emit('trigger-event', {
        name: 'step-complete',
        event: { stepId, completed },
      });
    };

    const handleEdit = (stepId) => {
      emit('trigger-event', {
        name: 'step-edit',
        event: { stepId },
      });
    };

    const handleDelete = (stepId) => {
      emit('trigger-event', {
        name: 'step-delete',
        event: { stepId },
      });
    };

    const handleResourceClick = (stepId, resource) => {
      emit('trigger-event', {
        name: 'resource-click',
        event: {
          stepId,
          resource: {
            id: resource?.id ?? null,
            name: resource?.name ?? resource?.nom ?? null,
            file_path: resource?.file_path ?? null,
            url: resource?.url ?? null,
            type: resource?.type ?? null,
            format: resource?.format ?? null,
          },
        },
      });
    };

    // ===== CSS VARIABLES =====
    const cssVariables = computed(() => ({
      '--card-background': props.content?.cardBackground || '#ffffff',
      '--card-border-color': props.content?.cardBorderColor || '#e5e7eb',
      '--card-border-radius': props.content?.cardBorderRadius || '8px',
      '--completed-color': props.content?.completedColor || '#22c55e',
      '--visible-badge-color': props.content?.visibleBadgeColor || '#22c55e',
      '--hidden-badge-color': props.content?.hiddenBadgeColor || '#9ca3af',
      '--resource-chip-bg': props.content?.resourceChipBackground || '#dbeafe',
      '--resource-chip-text': props.content?.resourceChipTextColor || '#1d4ed8',
      '--complete-button-color': props.content?.completeButtonColor || '#22c55e',
      '--edit-button-color': props.content?.editButtonColor || '#3b82f6',
      '--delete-button-color': props.content?.deleteButtonColor || '#ef4444',
      '--unlock-button-color': props.content?.unlockButtonColor || '#3b82f6',
      '--drag-over-highlight': props.content?.dragOverHighlightColor || '#eff6ff',
      '--rdv-badge-color': props.content?.rdvBadgeColor || '#8b5cf6',
      '--rdv-type-badge-color': props.content?.rdvTypeBadgeColor || '#6366f1',
      '--meeting-link-color': props.content?.meetingLinkColor || '#22c55e',
    }));

    return {
      localSteps,
      draggedIndex,
      dragOverIndex,
      cssVariables,
      getResourceName,
      getResourceType,
      getResourceUrl,
      getResourceSize,
      isRemoteRdv,
      getRdvTypeLabel,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleToggleVisibility,
      handleComplete,
      handleToggleComplete,
      handleEdit,
      handleDelete,
      handleResourceClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.parcours-steps-list {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.help-text {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-size: 14px;

  .help-icon {
    font-size: 16px;
  }
}

.empty-state {
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
  background: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: var(--card-border-radius);
  font-size: 15px;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-card {
  display: flex;
  background: var(--card-background);
  border: 1px solid var(--card-border-color);
  border-radius: var(--card-border-radius);
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.drag-over {
    background: var(--drag-over-highlight);
    border-color: #3b82f6;
    border-style: dashed;
  }

  &.dragging {
    opacity: 0.5;
    transform: scale(0.98);
  }
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  min-width: 32px;
  background: #f9fafb;
  border-right: 1px solid var(--card-border-color);
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  .handle-dots {
    color: #9ca3af;
    font-size: 14px;
    letter-spacing: 2px;
  }
}

.card-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #d1d5db;

  &.completed {
    color: var(--completed-color);
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

.status-icon-btn {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #d1d5db;
  transition: all 0.15s ease;

  &:hover {
    transform: scale(1.1);
    color: #9ca3af;
  }

  &.completed {
    color: var(--completed-color);

    &:hover {
      color: var(--completed-color);
      filter: brightness(1.1);
    }
  }

  svg {
    width: 100%;
    height: 100%;
  }
}

.step-title {
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.rdv-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--rdv-badge-color);
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;

  .rdv-icon {
    width: 12px;
    height: 12px;
  }
}

.date-badge {
  padding: 4px 10px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;

  &.date-right {
    margin-left: auto;
  }
}

.rdv-details-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 36px;
}

.rdv-datetime {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: #4b5563;
  font-size: 13px;

  .datetime-icon {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }
}

.rdv-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--rdv-type-badge-color);
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;

  .type-icon {
    width: 12px;
    height: 12px;
  }

  &.remote {
    background: var(--rdv-type-badge-color);
  }
}

.meeting-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--meeting-link-color);
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s ease;

  .link-icon {
    width: 16px;
    height: 16px;
  }

  &:hover {
    text-decoration: underline;
    filter: brightness(1.1);
  }
}

.resources-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 36px;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.resource-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #faf5ff;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    background: #f3e8ff;
    transform: translateY(-1px);
  }
}

.resource-file-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: #a855f7;

  svg {
    width: 100%;
    height: 100%;
  }
}

.resource-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.resource-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-meta {
  font-size: 12px;
  color: #6b7280;
}

.resource-open-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ec4899;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;

  .open-dot {
    width: 8px;
    height: 8px;
    background: #ec4899;
    border-radius: 50%;
  }
}

/* Old chip styles kept for backwards compatibility */
.resources-label {
  font-size: 13px;
  color: #6b7280;
}

.resources-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.resource-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--resource-chip-bg);
  color: var(--resource-chip-text);
  border-radius: 4px;
  font-size: 12px;
  text-decoration: none;

  .resource-icon {
    font-size: 12px;
  }

  .resource-type {
    opacity: 0.7;
    font-size: 11px;
  }
}

.visibility-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 36px;
  flex-wrap: wrap;
}

.visibility-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;

  .visibility-icon {
    font-size: 12px;
  }

  &.visible {
    background: rgba(34, 197, 94, 0.1);
    color: var(--visible-badge-color);
  }

  &.hidden {
    background: rgba(156, 163, 175, 0.1);
    color: var(--hidden-badge-color);
  }
}

.visibility-badge-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  .visibility-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }

  &.visible {
    background: rgba(34, 197, 94, 0.1);
    color: var(--visible-badge-color);

    &:hover {
      background: rgba(34, 197, 94, 0.15);
    }
  }

  &.hidden {
    background: rgba(156, 163, 175, 0.1);
    color: var(--hidden-badge-color);

    &:hover {
      background: rgba(156, 163, 175, 0.15);
    }
  }
}

.unlock-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--unlock-button-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .button-icon {
    font-size: 12px;
  }
}

.actions-section {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  .button-icon {
    font-size: 12px;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &.complete-button {
    color: var(--complete-button-color);
    border-color: var(--complete-button-color);

    &:hover {
      background: var(--complete-button-color);
      color: white;
    }
  }

  &.edit-button {
    color: var(--edit-button-color);
    border-color: var(--edit-button-color);

    &:hover {
      background: var(--edit-button-color);
      color: white;
    }
  }

  &.delete-button {
    color: var(--delete-button-color);
    border-color: var(--delete-button-color);

    &:hover {
      background: var(--delete-button-color);
      color: white;
    }
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .card-header {
    flex-wrap: wrap;
  }

  .date-badge {
    order: 3;
    margin-left: 36px;
    margin-top: 4px;

    &.date-right {
      margin-left: 36px;
    }
  }

  .rdv-badge {
    order: 2;
  }

  .rdv-details-section,
  .resources-section,
  .visibility-section {
    padding-left: 0;
  }

  .rdv-datetime {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions-section {
    justify-content: flex-start;
  }
}
</style>
