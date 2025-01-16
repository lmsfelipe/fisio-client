import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

export const ChevronDownIcon = () => {
  return (
    <svg
      fill="none"
      height="14"
      viewBox="0 0 24 24"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
        className="fill-primary"
      />
    </svg>
  );
};

export default function CreateAppointmentButton({ openModal }: any) {
  return (
    <ButtonGroup variant="flat" className="w-full">
      <Button
        onClick={openModal}
        size="lg"
        className="bg-white text-md text-primary"
      >
        Criar agendamento
      </Button>

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly size="lg" className="bg-white">
            <ChevronDownIcon />
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Opcões de criação">
          <DropdownItem key="patient" href="/cadastrar-paciente">
            Cadastrar paciente
          </DropdownItem>

          <DropdownItem key="squash" href="/cadastrar-profissional">
            Cadastrar profissional
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
}
