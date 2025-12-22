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
            <!-- Status Icon -->
            <div class="status-icon" :class="{ completed: step.isCompleted }">
              <svg v-if="step.isCompleted" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>

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
            <span class="resources-label">{{ content?.resourcesLabel || 'Ressources :' }}</span>
            <div class="resources-chips">
              <span
                v-for="(resource, rIndex) in step.resources"
                :key="rIndex"
                class="resource-chip"
              >
                <span class="resource-icon">&#x1F4CE;</span>
                {{ getResourceName(resource) }}
                <span v-if="getResourceType(resource)" class="resource-type">({{ getResourceType(resource) }})</span>
              </span>
            </div>
          </div>

          <!-- Visibility Section -->
          <div v-if="content?.showVisibility !== false" class="visibility-section">
            <span v-if="step.isVisible" class="visibility-badge visible">
              <span class="visibility-icon">&#x1F441;</span>
              {{ content?.visibleText || 'Visible par le bénéficiaire' }}
            </span>
            <template v-else>
              <span class="visibility-badge hidden">
                <span class="visibility-icon">&#x1F512;</span>
                {{ content?.hiddenText || 'Masquée pour le bénéficiaire' }}
              </span>
              <button
                class="unlock-button"
                @click.stop="handleToggleVisibility(step.id, true)"
              >
                <span class="button-icon">&#x1F513;</span>
                {{ content?.unlockText || 'Débloquer cette étape' }}
              </button>
            </template>
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
        }

        // Fallback to path-based lookup
        id = id ?? getNestedValue(item, idPath) ?? item?.id ?? `step-${index}`;
        title = title ?? getNestedValue(item, titlePath) ?? item?.titre ?? item?.title ?? 'Sans titre';
        order = order ?? getNestedValue(item, orderPath) ?? item?.ordre ?? item?.order ?? (index + 1);
        status = status ?? getNestedValue(item, statusPath) ?? item?.statut ?? item?.status ?? '';
        isVisible = isVisible ?? getNestedValue(item, visiblePath) ?? item?.est_visible_beneficiaire ?? item?.isVisible ?? true;
        resources = resources ?? getNestedValue(item, resourcesPath) ?? item?.ressources ?? item?.resources ?? [];
        date = date ?? getNestedValue(item, datePath) ?? item?.date ?? null;
        isRdv = isRdv ?? getNestedValue(item, isRdvPath) ?? item?.est_rdv ?? item?.isRdv ?? item?.is_rdv ?? false;
        rdvType = rdvType ?? getNestedValue(item, rdvTypePath) ?? item?.type_rdv ?? item?.rdvType ?? item?.meeting_type ?? null;
        meetingLink = meetingLink ?? getNestedValue(item, meetingLinkPath) ?? item?.lien_visio ?? item?.meetingLink ?? item?.meeting_link ?? null;

        // Auto-detect RDV if rdvType exists but isRdv is not explicitly set
        const finalIsRdv = Boolean(isRdv) || Boolean(rdvType);

        // Core flag - prevents edit/delete for core steps
        const isCore = Boolean(item?.core);

        return {
          id: String(id),
          title: String(title),
          order: Number(order) || (index + 1),
          status: String(status || ''),
          isVisible: Boolean(isVisible),
          isCompleted: String(status).toLowerCase() === String(completedValue).toLowerCase(),
          resources: Array.isArray(resources) ? resources : [],
          date: date ? String(date) : null,
          isRdv: finalIsRdv,
          rdvType: rdvType ? String(rdvType) : null,
          meetingLink: meetingLink ? String(meetingLink) : null,
          core: isCore,
          canEdit: !isCore,
          canDelete: !isCore,
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
      return resource?.type ?? resource?.extension ?? null;
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
      isRemoteRdv,
      getRdvTypeLabel,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleToggleVisibility,
      handleComplete,
      handleEdit,
      handleDelete,
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
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-left: 36px;
}

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
