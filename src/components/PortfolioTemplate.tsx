'use client';

import Link from 'next/link';
import { PortfolioData } from '@/types/portfolio';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { LinkedText } from '@/components/LinkedText';
import { mailtoHref, normalizeExternalHref } from '@/lib/external-links';

interface EditableTextProps {
  value: string;
  onSave: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  nextFocusId?: string;
  id?: string;
  linkify?: boolean;
  linkClassName?: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element?: any;
  isEditing: boolean;
  setFocusTicket: (ticket: { id: string } | null) => void;
}

function EditableText({
  value, onSave, onKeyDown, nextFocusId, id, linkify, linkClassName, className = "",
  element: Element = "span", isEditing, setFocusTicket
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isFocused = useRef(false);

  useLayoutEffect(() => {
    if (!isEditing || !ref.current || isFocused.current) return;
    if (ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value, isEditing]);

  if (!isEditing) {
    if (linkify) {
      return (
        <Element className={className}>
          <LinkedText text={value} linkClassName={linkClassName} />
        </Element>
      );
    }
    return <Element className={className}>{value}</Element>;
  }

  return (
    <Element
      ref={ref}
      id={id}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => { isFocused.current = true; }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        isFocused.current = false;
        onSave(e.currentTarget.innerText.replace(/\n/g, ' ').trim());
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (onKeyDown) {
          onKeyDown(e);
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          onSave(e.currentTarget.innerText.replace(/\n/g, ' ').trim());
          if (nextFocusId) {
            setFocusTicket({ id: nextFocusId });
          }
        }
      }}
      className={`${className} outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 -mx-1 hover:bg-white/5 transition-colors cursor-text`}
    />
  );
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isEditing: boolean;
}

function SortableItem({ id, children, className = "", isEditing }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group/block ${className} ${isDragging ? 'z-50' : ''}`}
    >
      {isEditing && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-8 top-1 opacity-0 group-hover/block:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300 z-30"
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </div>
      )}
      {children}
    </div>
  );
}

interface ThemeStyles {
  bg: string; text: string; muted: string; border: string;
  accent: string; accentBg: string; card: string; label: string;
}

interface SortableBulletProps {
  id: string;
  bullet: string;
  idx: number;
  bulletIdx: number;
  isEditing: boolean;
  themeStyles: ThemeStyles;
  onSave: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onAdd: () => void;
  onDelete: () => void;
  setFocusTicket: (ticket: { id: string } | null) => void;
}

function SortableBullet({
  id, bullet, idx, bulletIdx, isEditing, themeStyles,
  onSave, onKeyDown, onAdd, onDelete, setFocusTicket,
}: SortableBulletProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <li ref={setNodeRef} style={style} className={`${themeStyles.muted} text-sm flex items-start group/bullet`}>
      {isEditing && (
        <div className="flex items-center gap-0.5 flex-shrink-0 mr-2 mt-0.5 opacity-0 group-hover/bullet:opacity-100 transition-opacity relative" ref={menuRef}>
          {/* + add button */}
          <button
            onClick={onAdd}
            className="p-1 hover:bg-blue-500/20 rounded text-blue-500 transition-colors"
            title="Add bullet below"
          >
            <Plus size={13} />
          </button>

          {/* Grip — drag to reorder, click to open menu */}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => {
              // Only open menu on click (not after a drag)
              if (!isDragging) {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }
            }}
            className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-grab active:cursor-grabbing"
            title="Drag to reorder · Click for options"
          >
            <GripVertical size={13} />
          </button>

          {/* Submenu */}
          {menuOpen && (
            <div
              className="absolute left-0 top-full mt-1 z-50 min-w-[130px] rounded-lg border border-white/10 bg-slate-900 shadow-xl py-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { setMenuOpen(false); onDelete(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <Trash2 size={12} />
                Delete bullet
              </button>
            </div>
          )}
        </div>
      )}

      <span className={`${themeStyles.label} mt-1 mr-2 flex-shrink-0`}>•</span>
      <EditableText
        id={`bullet-${idx}-${bulletIdx}`}
        value={bullet}
        onSave={onSave}
        onKeyDown={onKeyDown}
        linkify
        linkClassName={`${themeStyles.accent} underline underline-offset-2`}
        className="flex-1"
        isEditing={isEditing}
        setFocusTicket={setFocusTicket}
      />
    </li>
  );
}

interface Props {
  data: PortfolioData;
  isEditing?: boolean;
  onUpdate?: (newData: PortfolioData) => void;
}

export default function PortfolioTemplate({ data, isEditing, onUpdate }: Props) {
  const theme = data.theme || 'midnight';
  const sectionOrder = data.sectionOrder || ['experience', 'education', 'skills'];

  const themeStyles = {
    midnight: {
      bg: 'bg-black',
      text: 'text-white',
      muted: 'text-gray-400',
      border: 'border-gray-900',
      accent: 'text-blue-500',
      accentBg: 'bg-gray-900',
      card: 'bg-gray-900/50',
      label: 'text-gray-600',
    },
    snow: {
      bg: 'bg-white',
      text: 'text-slate-900',
      muted: 'text-slate-500',
      border: 'border-slate-100',
      accent: 'text-blue-600',
      accentBg: 'bg-slate-50',
      card: 'bg-slate-50/50',
      label: 'text-slate-400',
    },
    cobalt: {
      bg: 'bg-slate-950',
      text: 'text-slate-50',
      muted: 'text-slate-400',
      border: 'border-slate-800',
      accent: 'text-cyan-400',
      accentBg: 'bg-slate-900',
      card: 'bg-slate-900/50',
      label: 'text-slate-600',
    }
  }[theme];

  const handleUpdate = (newData: PortfolioData) => {
    onUpdate?.(newData);
  };

  const getEditableText = (event: React.KeyboardEvent<HTMLElement>) =>
    event.currentTarget.innerText.replace(/\n/g, ' ').trim();

  const handleChange = (path: string, value: string) => {
    if (!onUpdate) return;

    const newData = { ...data };
    const parts = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = newData;

    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }

    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('[')) {
      const [prop, indexPart] = lastPart.split('[');
      const index = parseInt(indexPart.replace(']', ''));
      current[prop][index] = value;
    } else {
      current[lastPart] = value;
    }
    onUpdate(newData);
  };

  const handleArrayUpdate = (path: string, index: number, value: string) => {
    if (!onUpdate) return;
    const newData = { ...data };
    const parts = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = newData;
    for (let i = 0; i < parts.length; i++) {
      current = current[parts[i]];
    }
    current[index] = value;
    onUpdate(newData);
  };

  const [focusTicket, setFocusTicket] = useState<{ id: string } | null>(null);

  useEffect(() => {
    if (focusTicket) {
      const el = document.getElementById(focusTicket.id);
      if (el) {
        el.focus({ preventScroll: true });
        // Place cursor at end — save/restore scroll because selection.addRange
        // scrolls the element into view even when preventScroll is set on focus()
        const scrollY = window.scrollY;
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        window.scrollTo({ top: scrollY });
      }
      setFocusTicket(null);
    }
  }, [focusTicket]);

  useEffect(() => {
    if (isEditing) {
      setFocusTicket({ id: 'profile-name' });
    }
  }, [isEditing]);

  const addListItem = (section: 'experience' | 'education' | 'skills', index: number, subIndex?: number) => {
    if (!onUpdate) return;
    const newData = { ...data };

    if (section === 'experience' && typeof subIndex === 'number') {
      newData.experience[index].bullets.splice(subIndex + 1, 0, "");
      onUpdate(newData);
      setFocusTicket({ id: `bullet-${index}-${subIndex + 1}` });
    } else if (section === 'experience') {
      newData.experience.splice(index + 1, 0, {
        role: "New Role",
        company: "New Company",
        dates: "Dates",
        bullets: [""]
      });
      onUpdate(newData);
      setFocusTicket({ id: `exp-role-${index + 1}` });
    } else if (section === 'education') {
      newData.education.splice(index + 1, 0, {
        institution: "New Institution",
        degree: "Degree",
        dates: "Dates"
      });
      onUpdate(newData);
      setFocusTicket({ id: `edu-inst-${index + 1}` });
    } else if (section === 'skills') {
      newData.skills.splice(index + 1, 0, "New Skill");
      onUpdate(newData);
      setFocusTicket({ id: `skill-${index + 1}` });
    }
  };

  const removeListItem = (section: 'experience' | 'education' | 'skills', index: number, subIndex?: number) => {
    if (!onUpdate) return;
    const newData = { ...data };

    if (section === 'experience' && typeof subIndex === 'number') {
      if (newData.experience[index].bullets.length <= 1) return; // Don't remove last bullet
      newData.experience[index].bullets.splice(subIndex, 1);
      onUpdate(newData);
      setFocusTicket({ id: `bullet-${index}-${Math.max(0, subIndex - 1)}` });
    } else if (section === 'experience') {
      newData.experience.splice(index, 1);
      onUpdate(newData);
    } else if (section === 'education') {
      newData.education.splice(index, 1);
      onUpdate(newData);
    } else if (section === 'skills') {
      newData.skills.splice(index, 1);
      onUpdate(newData);
      setFocusTicket({ id: `skill-${Math.max(0, index - 1)}` });
    }
  };

  const handleBulletDragEnd = (event: any, expIdx: number) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parseInt(String(active.id).split('-')[2]);
    const newIndex = parseInt(String(over.id).split('-')[2]);
    const newExp = [...data.experience];
    newExp[expIdx] = {
      ...newExp[expIdx],
      bullets: arrayMove(newExp[expIdx].bullets, oldIndex, newIndex),
    };
    handleUpdate({ ...data, experience: newExp });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    type: 'bullet' | 'education' | 'skill',
    idx: number,
    subIdx?: number,
    currentValue?: string,
    onSave?: (value: string) => void
  ) => {
    const liveValue = getEditableText(e as React.KeyboardEvent<HTMLElement>);
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave?.(liveValue);
      if (type === 'bullet') addListItem('experience', idx, subIdx);
      else if (type === 'education') addListItem('education', idx);
      else if (type === 'skill') addListItem('skills', idx);
    } else if (e.key === 'Backspace' && (liveValue === "" || currentValue === "")) {
      e.preventDefault();
      if (type === 'bullet') removeListItem('experience', idx, subIdx);
      else if (type === 'skill') removeListItem('skills', idx);
      // For education, we might not want to delete accidentally on empty field
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any, type: 'sections' | 'experience' | 'education') => {
    const { active, over } = event;

    if (active.id !== over.id) {
      if (type === 'sections') {
        const oldIndex = sectionOrder.indexOf(active.id);
        const newIndex = sectionOrder.indexOf(over.id);
        handleUpdate({ ...data, sectionOrder: arrayMove(sectionOrder, oldIndex, newIndex) });
      } else if (type === 'experience') {
        const oldIndex = parseInt(active.id.split('-')[1]);
        const newIndex = parseInt(over.id.split('-')[1]);
        handleUpdate({ ...data, experience: arrayMove(data.experience, oldIndex, newIndex) });
      } else if (type === 'education') {
        const oldIndex = parseInt(active.id.split('-')[1]);
        const newIndex = parseInt(over.id.split('-')[1]);
        handleUpdate({ ...data, education: arrayMove(data.education, oldIndex, newIndex) });
      }
    }
  };

  const renderSection = (type: string) => {
    switch (type) {
      case 'experience':
        if (data.experience.length === 0 && !isEditing) return null;
        return (
          <section key="experience" className="mb-16">
            <h4 className={`text-sm font-bold uppercase tracking-widest ${themeStyles.label} mb-8`}>Experience</h4>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'experience')}
            >
              <SortableContext
                items={data.experience.map((_, i) => `exp-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-12">
                  {data.experience.map((exp, idx) => (
                    <SortableItem key={`exp-${idx}`} id={`exp-${idx}`} isEditing={!!isEditing}>
                      <div className="mb-4">
                        <EditableText
                          id={`exp-role-${idx}`}
                          element="h5"
                          value={exp.role}
                          onSave={(v) => {
                            const newExp = [...data.experience];
                            newExp[idx].role = v;
                            handleUpdate({ ...data, experience: newExp });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const newExp = [...data.experience];
                              newExp[idx].role = getEditableText(e as React.KeyboardEvent<HTMLElement>);
                              handleUpdate({ ...data, experience: newExp });
                              setFocusTicket({ id: `exp-company-${idx}` });
                            }
                          }}
                          className="text-lg font-medium mb-1 block"
                          isEditing={!!isEditing}
                          setFocusTicket={setFocusTicket}
                        />
                        <EditableText
                          id={`exp-company-${idx}`}
                          element="p"
                          value={exp.company}
                          onSave={(v) => {
                            const newExp = [...data.experience];
                            newExp[idx].company = v;
                            handleUpdate({ ...data, experience: newExp });
                          }}
                          nextFocusId={`bullet-${idx}-0`}
                          className={`${themeStyles.muted} mb-2 block`}
                          isEditing={!!isEditing}
                          setFocusTicket={setFocusTicket}
                        />
                      </div>
                      <div className={`flex gap-2 text-sm ${themeStyles.label} mb-4`}>
                        <EditableText
                          value={exp.dates}
                          onSave={(v) => {
                            const newExp = [...data.experience];
                            newExp[idx].dates = v;
                            handleUpdate({ ...data, experience: newExp });
                          }}
                          isEditing={!!isEditing}
                          setFocusTicket={setFocusTicket}
                        />
                        {exp.location && (
                          <>
                            <span>—</span>
                            <EditableText
                              value={exp.location}
                              onSave={(v) => {
                                const newExp = [...data.experience];
                                newExp[idx].location = v;
                                handleUpdate({ ...data, experience: newExp });
                              }}
                              isEditing={!!isEditing}
                              setFocusTicket={setFocusTicket}
                            />
                          </>
                        )}
                      </div>
                      {exp.bullets.length > 0 && (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(e) => handleBulletDragEnd(e, idx)}
                        >
                          <SortableContext
                            items={exp.bullets.map((_, bIdx) => `bullet-${idx}-${bIdx}`)}
                            strategy={verticalListSortingStrategy}
                          >
                            <ul className="space-y-3">
                              {exp.bullets.map((bullet, bulletIdx) => (
                                <SortableBullet
                                  key={`bullet-${idx}-${bulletIdx}`}
                                  id={`bullet-${idx}-${bulletIdx}`}
                                  bullet={bullet}
                                  idx={idx}
                                  bulletIdx={bulletIdx}
                                  isEditing={!!isEditing}
                                  themeStyles={themeStyles}
                                  onSave={(v) => {
                                    const newExp = [...data.experience];
                                    newExp[idx].bullets[bulletIdx] = v;
                                    handleUpdate({ ...data, experience: newExp });
                                  }}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, 'bullet', idx, bulletIdx, bullet, (v) => {
                                      const newExp = [...data.experience];
                                      newExp[idx].bullets[bulletIdx] = v;
                                      handleUpdate({ ...data, experience: newExp });
                                    })
                                  }
                                  onAdd={() => addListItem('experience', idx, bulletIdx)}
                                  onDelete={() => removeListItem('experience', idx, bulletIdx)}
                                  setFocusTicket={setFocusTicket}
                                />
                              ))}
                            </ul>
                          </SortableContext>
                        </DndContext>
                      )}
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </section>
        );
      case 'education':
        if (data.education.length === 0 && !isEditing) return null;
        return (
          <section key="education" className="mb-16">
            <h4 className={`text-sm font-bold uppercase tracking-widest ${themeStyles.label} mb-8`}>Education</h4>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'education')}
            >
              <SortableContext
                items={data.education.map((_, i) => `edu-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-8">
                  {data.education.map((edu, idx) => (
                    <SortableItem key={`edu-${idx}`} id={`edu-${idx}`} isEditing={!!isEditing}>
                      <EditableText
                        id={`edu-inst-${idx}`}
                        element="h5"
                        value={edu.institution}
                        onSave={(v) => {
                          const newEdu = [...data.education];
                          newEdu[idx].institution = v;
                          handleUpdate({ ...data, education: newEdu });
                        }}
                        onKeyDown={(e) =>
                          handleKeyDown(e, 'education', idx, undefined, edu.institution, (v) => {
                            const newEdu = [...data.education];
                            newEdu[idx].institution = v;
                            handleUpdate({ ...data, education: newEdu });
                          })
                        }
                        className="text-lg font-medium mb-1 block"
                        isEditing={!!isEditing}
                        setFocusTicket={setFocusTicket}
                      />
                      {isEditing && (
                        <div className="absolute -left-10 top-0 flex gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                          <button
                            onClick={() => addListItem('education', idx)}
                            className="p-1 hover:bg-blue-500/20 rounded text-blue-500 transition-colors"
                            title="Add education entry below"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeListItem('education', idx)}
                            className="p-1 hover:bg-red-500/20 rounded text-red-500 transition-colors"
                            title="Remove education entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      <div className={`${themeStyles.muted} flex gap-1 flex-wrap`}>
                        <EditableText
                          value={edu.degree}
                          onSave={(v) => {
                            const newEdu = [...data.education];
                            newEdu[idx].degree = v;
                            handleUpdate({ ...data, education: newEdu });
                          }}
                          isEditing={!!isEditing}
                          setFocusTicket={setFocusTicket}
                        />
                        {edu.field && (
                          <>
                            <span>in</span>
                            <EditableText
                              value={edu.field}
                              onSave={(v) => {
                                const newEdu = [...data.education];
                                newEdu[idx].field = v;
                                handleUpdate({ ...data, education: newEdu });
                              }}
                              isEditing={!!isEditing}
                              setFocusTicket={setFocusTicket}
                            />
                          </>
                        )}
                      </div>
                      <div className={`text-sm ${themeStyles.label} mt-2 flex gap-2`}>
                        <EditableText
                          value={edu.dates}
                          onSave={(v) => {
                            const newEdu = [...data.education];
                            newEdu[idx].dates = v;
                            handleUpdate({ ...data, education: newEdu });
                          }}
                          isEditing={!!isEditing}
                          setFocusTicket={setFocusTicket}
                        />
                        {edu.location && (
                          <>
                            <span>•</span>
                            <EditableText
                              value={edu.location}
                              onSave={(v) => {
                                const newEdu = [...data.education];
                                newEdu[idx].location = v;
                                handleUpdate({ ...data, education: newEdu });
                              }}
                              isEditing={!!isEditing}
                              setFocusTicket={setFocusTicket}
                            />
                          </>
                        )}
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </section>
        );
      case 'skills':
        if (data.skills.length === 0 && !isEditing) return null;
        return (
          <section key="skills">
            <h4 className={`text-sm font-bold uppercase tracking-widest ${themeStyles.label} mb-8`}>Skills</h4>
            <div className="flex flex-wrap gap-3 items-center">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="group/skill relative">
                  <EditableText
                    id={`skill-${idx}`}
                    value={skill}
                    onSave={(v) => handleArrayUpdate('skills', idx, v)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, 'skill', idx, undefined, skill, (v) =>
                        handleArrayUpdate('skills', idx, v)
                      )
                    }
                    linkify
                    linkClassName={`${themeStyles.accent} underline underline-offset-2`}
                    className={`px-4 py-2 ${themeStyles.accentBg} ${themeStyles.muted} rounded text-sm border ${themeStyles.border} hover:border-gray-700 transition-colors inline-block`}
                    isEditing={!!isEditing}
                    setFocusTicket={setFocusTicket}
                  />
                  {isEditing && (
                    <button
                      onClick={() => removeListItem('skills', idx)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/skill:opacity-100 transition-opacity shadow-lg scale-75"
                      title="Remove skill"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => addListItem('skills', data.skills.length - 1)}
                  className={`px-4 py-2 border-2 border-dashed ${themeStyles.border} ${themeStyles.muted} rounded text-sm hover:border-blue-500 hover:text-blue-500 transition-all flex items-center gap-2 group/add-skill`}
                >
                  <Plus size={14} className="group-hover/add-skill:rotate-90 transition-transform" />
                  Add Skill
                </button>
              )}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} transition-colors duration-500`}>
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <EditableText
          id="profile-name"
          element="h1"
          value={data.name}
          onSave={(v) => handleChange('name', v)}
          nextFocusId="profile-title"
          className="text-6xl font-extralight mb-6 tracking-tight block"
          isEditing={!!isEditing}
          setFocusTicket={setFocusTicket}
        />
        <EditableText
          id="profile-title"
          element="p"
          value={data.title}
          onSave={(v) => handleChange('title', v)}
          nextFocusId="profile-summary"
          className={`text-2xl ${themeStyles.muted} mb-12 block font-light`}
          isEditing={!!isEditing}
          setFocusTicket={setFocusTicket}
        />

        {/* Contact Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium">
          {data.contact.email && (
            <div className="flex items-center gap-3">
              <span className={themeStyles.label}>Email</span>
              {isEditing ? (
                <EditableText
                  value={data.contact.email}
                  onSave={(v) => handleChange('contact.email', v)}
                  className={`${themeStyles.muted} hover:${themeStyles.text} transition-colors border-b ${themeStyles.border}`}
                  isEditing={!!isEditing}
                  setFocusTicket={setFocusTicket}
                />
              ) : mailtoHref(data.contact.email) ? (
                <a
                  href={mailtoHref(data.contact.email)!}
                  className={`${themeStyles.muted} ${themeStyles.accent} transition-colors border-b ${themeStyles.border}`}
                >
                  {data.contact.email}
                </a>
              ) : (
                <span className={`${themeStyles.muted} border-b ${themeStyles.border}`}>
                  <LinkedText
                    text={data.contact.email}
                    linkClassName={`${themeStyles.accent} underline underline-offset-2`}
                  />
                </span>
              )}
            </div>
          )}
          {data.contact.linkedin && (
            <div className="flex items-center gap-3">
              <span className={themeStyles.label}>LinkedIn</span>
              {isEditing ? (
                <EditableText
                  value={data.contact.linkedin}
                  onSave={(v) => handleChange('contact.linkedin', v)}
                  className={`${themeStyles.muted} hover:${themeStyles.text} transition-colors border-b ${themeStyles.border}`}
                  isEditing={!!isEditing}
                  setFocusTicket={setFocusTicket}
                />
              ) : normalizeExternalHref(data.contact.linkedin) ? (
                <a
                  href={normalizeExternalHref(data.contact.linkedin)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${themeStyles.muted} ${themeStyles.accent} transition-colors border-b ${themeStyles.border}`}
                >
                  {data.contact.linkedin}
                </a>
              ) : (
                <span className={`${themeStyles.muted} border-b ${themeStyles.border}`}>
                  <LinkedText
                    text={data.contact.linkedin}
                    linkClassName={`${themeStyles.accent} underline underline-offset-2`}
                  />
                </span>
              )}
            </div>
          )}
          {data.contact.website && (
            <div className="flex items-center gap-3">
              <span className={themeStyles.label}>Website</span>
              {isEditing ? (
                <EditableText
                  value={data.contact.website}
                  onSave={(v) => handleChange('contact.website', v)}
                  className={`${themeStyles.muted} hover:${themeStyles.text} transition-colors border-b ${themeStyles.border}`}
                  isEditing={!!isEditing}
                  setFocusTicket={setFocusTicket}
                />
              ) : normalizeExternalHref(data.contact.website) ? (
                <a
                  href={normalizeExternalHref(data.contact.website)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${themeStyles.muted} ${themeStyles.accent} transition-colors border-b ${themeStyles.border}`}
                >
                  {data.contact.website}
                </a>
              ) : (
                <span className={`${themeStyles.muted} border-b ${themeStyles.border}`}>
                  <LinkedText
                    text={data.contact.website}
                    linkClassName={`${themeStyles.accent} underline underline-offset-2`}
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-32">
        {/* Summary */}
        {data.summary && (
          <section className="mb-24">
            <EditableText
              id="profile-summary"
              element="p"
              value={data.summary}
              onSave={(v) => handleChange('summary', v)}
              linkify
              linkClassName={`${themeStyles.accent} underline underline-offset-2`}
              className={`text-xl leading-relaxed font-light ${themeStyles.text} opacity-90`}
              isEditing={!!isEditing}
              setFocusTicket={setFocusTicket}
            />
          </section>
        )}

        <div className="space-y-24">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, 'sections')}
          >
            <SortableContext
              items={sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              {sectionOrder.map((type) => (
                <SortableItem key={type} id={type} isEditing={!!isEditing}>
                  {renderSection(type)}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </main>

      {/* Footer */}
      <footer className={`max-w-4xl mx-auto px-6 py-16 text-center ${themeStyles.label} text-xs border-t ${themeStyles.border} mt-32`}>
        <p className="tracking-widest uppercase mb-2">Designed and Built by AI</p>
        <p>
          Generated with{' '}
          <Link href="/" className={`${themeStyles.muted} hover:${themeStyles.text} transition-colors font-bold`}>
            CV TO WEB
          </Link>
        </p>
      </footer>
    </div>
  );
}
