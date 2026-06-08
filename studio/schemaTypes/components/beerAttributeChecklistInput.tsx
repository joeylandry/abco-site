import {useEffect, useMemo, useState} from 'react'
import {Button, Card, Checkbox, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {PatchEvent, set, useClient, type ArrayOfPrimitivesInputProps} from 'sanity'
import {
  formatBeerAttributeTitle,
  normalizeBeerAttributeValue,
  type BeerAttributeGroupKey,
  type BeerAttributeOption,
} from '../shared/beerAttributes'
import {emptyBeerAttributeLibrary} from '../documents/beerAttributeLibrary'

type BeerAttributeChecklistInputProps = ArrayOfPrimitivesInputProps<string> & {
  groupKey: BeerAttributeGroupKey
  groupTitle: string
  defaultOptions: readonly BeerAttributeOption[]
}

type BeerAttributeLibraryDoc = Partial<Record<BeerAttributeGroupKey, string[]>>

const beerAttributeLibraryDocId = 'beerAttributeLibrary'

function getEmptyBeerAttributeLibrary() {
  return {...emptyBeerAttributeLibrary}
}

export function BeerAttributeChecklistInput({
  groupKey,
  groupTitle,
  defaultOptions,
  value,
  onChange,
  readOnly,
}: BeerAttributeChecklistInputProps) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [customValues, setCustomValues] = useState<string[]>([])
  const [draftValue, setDraftValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadCustomValues() {
      setIsLoading(true)

      try {
        const doc = await client.fetch<BeerAttributeLibraryDoc | null>(
          `*[_type == "beerAttributeLibrary" && _id == $id][0]{${groupKey}}`,
          {id: beerAttributeLibraryDocId},
        )

        if (!mounted) {
          return
        }

        setCustomValues(
          Array.isArray(doc?.[groupKey])
            ? doc![groupKey]!.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            : [],
        )
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadCustomValues()

    return () => {
      mounted = false
    }
  }, [client, groupKey])

  const availableOptions = useMemo(() => {
    const customOptions = customValues
      .filter((value, index, values) => values.indexOf(value) === index)
      .map((value) => ({
        title: formatBeerAttributeTitle(value),
        value,
      }))

    const seen = new Set<string>()
    return [...defaultOptions, ...customOptions].filter((option) => {
      if (seen.has(option.value)) {
        return false
      }

      seen.add(option.value)
      return true
    })
  }, [customValues, defaultOptions])

  const selectedValues = value ?? []
  const selectedValueSet = useMemo(() => new Set(selectedValues), [selectedValues])

  const updateSelectedValues = (nextValues: string[]) => {
    onChange(PatchEvent.from(set(nextValues)))
  }

  const toggleValue = (optionValue: string) => {
    if (readOnly) {
      return
    }

    const nextValues = selectedValueSet.has(optionValue)
      ? selectedValues.filter((currentValue) => currentValue !== optionValue)
      : [...selectedValues, optionValue]

    updateSelectedValues(nextValues)
  }

  const addCustomOption = async () => {
    if (readOnly || isSaving) {
      return
    }

    const nextValue = normalizeBeerAttributeValue(draftValue)
    if (!nextValue) {
      return
    }

    if (!selectedValueSet.has(nextValue)) {
      updateSelectedValues([...selectedValues, nextValue])
    }

    if (defaultOptions.some((option) => option.value === nextValue) || customValues.includes(nextValue)) {
      setDraftValue('')
      return
    }

    setIsSaving(true)

    try {
      await client.createIfNotExists({
        _id: beerAttributeLibraryDocId,
        _type: 'beerAttributeLibrary',
        ...getEmptyBeerAttributeLibrary(),
      })

      await client
        .patch(beerAttributeLibraryDocId)
        .setIfMissing({[groupKey]: []})
        .append(groupKey, [nextValue])
        .commit()

      setCustomValues((currentValues) =>
        currentValues.includes(nextValue) ? currentValues : [...currentValues, nextValue],
      )
      setDraftValue('')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Stack space={4}>
      <Stack space={2}>
        {isLoading ? (
          <Text size={1} muted>
            Loading reusable options...
          </Text>
        ) : null}

        <Stack space={2}>
          {availableOptions.map((option) => {
            const isSelected = selectedValueSet.has(option.value)

            return (
              <Card
                key={option.value}
                border
                radius={2}
                tone={isSelected ? 'primary' : 'default'}
                padding={3}
                shadow={isSelected ? 1 : 0}
              >
                <Flex as="label" gap={3} align="center" style={{cursor: readOnly ? 'not-allowed' : 'pointer'}}>
                  <Checkbox
                    checked={isSelected}
                    disabled={readOnly}
                    onChange={() => toggleValue(option.value)}
                  />
                  <Text weight="medium">{option.title}</Text>
                </Flex>
              </Card>
            )
          })}
        </Stack>
      </Stack>

      <Card border radius={2} padding={3} tone="transparent">
        <Stack space={3}>
          <Stack space={1}>
            <Text size={1} weight="medium">
              Add custom {groupTitle.toLowerCase()}
            </Text>
            <Text size={1} muted>
              This saves the new value to the shared library so it shows up on future beers.
            </Text>
          </Stack>

          <Flex gap={2} align="flex-start">
            <TextInput
              value={draftValue}
              onChange={(event) => setDraftValue(event.currentTarget.value)}
              placeholder={`Type a new ${groupTitle.toLowerCase()} option`}
              disabled={readOnly || isSaving}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void addCustomOption()
                }
              }}
              style={{flex: 1}}
            />
            <Button
              text={isSaving ? 'Saving...' : 'Add'}
              tone="primary"
              mode="default"
              disabled={readOnly || isSaving || normalizeBeerAttributeValue(draftValue).length === 0}
              onClick={() => {
                void addCustomOption()
              }}
            />
          </Flex>
        </Stack>
      </Card>
    </Stack>
  )
}
